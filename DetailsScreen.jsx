import React, { useState, useEffect } from 'react';
import { Button, View, Text, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from './MainContainer';
import { supabase } from './supabase';
import { useUser } from './UserContext';

export default function DetailsScreen({ navigation, route }) {
  const { cryptocurrencyId } = route.params || {};
  const apiKey = 'df0e96ea-ff39-444e-8158-cb8354f7f3a4';

  const { userId } = useUser();

  const [chartData, setChartData] = useState(null);
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null); //VALOR ACTUAL CRPYTO
  const [priceChange, setPriceChange] = useState(null); //PORCENTJE CAMBIADO DE CRPYTO
  const [timeRange, setTimeRange] = useState('weekly'); //INTERVALO DE TIEMPO POR DEFECTO
   
  const [invested, setInvested] = useState(0);//DINERO INVERTIDO
  const [value, setValue] = useState(0); //EL VALOR ACTUAL DE LA INVERSION

  //MODAL INVERSION
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  //MODAL RETIRAR
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  //INTERVALOS DE TIEMPO DEL GRAFICO
  const timeRanges = {
    'weekly': { interval: 'weekly', count: 7, label: 'last week' },
    'daily': { interval: 'daily', count: 7, label: 'last 24 hours' },
    'hourly': { interval: 'hourly', count: 7, label: 'last hour' },
    '10m': { interval: '10m', count: 7, label: 'last 10 minutes' },
    '5m': { interval: '5m', count: 7, label: 'last 5 minutes' },
  };

  useEffect(() => {
    //FUNCION PARA OBTENER EL GRAFICO
    const fetchChartData = async () => {
      try {
        const { interval } = timeRanges[timeRange];
        const { count } = timeRanges[timeRange];
    
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?id=${cryptocurrencyId}&interval=${interval}&count=${count}&CMC_PRO_API_KEY=${apiKey}`);
        const data = await response.json();
        const quotes = data.data.quotes;
        const prices = quotes.map(quote => quote.quote.USD.price);
        const labels = quotes.map(quote => {
          const date = new Date(quote.timestamp);
          if (interval === '5m' || interval === '10m' || interval === 'hourly') {
            return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          } else {
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit'}); //, year: '2-digit'
          }
        });
    
        setChartData({
          labels: labels,
          datasets: [{ data: prices }],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    //FUNCION PARA LOGO Y NOMBRE, Y PARA PORCENTAJES DE LOS ULTIMOS DIAS
    const fetchCryptoData = async () => {
      try {
        const infoResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${cryptocurrencyId}&CMC_PRO_API_KEY=${apiKey}`);
        const infoData = await infoResponse.json();
        const valueResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${cryptocurrencyId}&CMC_PRO_API_KEY=${apiKey}`);
        const valueData = await valueResponse.json();

        const info = infoData.data[cryptocurrencyId];
        const value = valueData.data[cryptocurrencyId];

        setCryptoInfo(info);
        setCurrentPrice(value.quote.USD.price);

        // Calcular cambio en las últimas 24 horas
        const last24hPrice = value.quote.USD.percent_change_24h;
        let changePercentage = 0;

        if (timeRange === 'weekly') {
          changePercentage = value.quote.USD.percent_change_7d;
        } else if (timeRange === 'daily') {
          changePercentage = last24hPrice;
        } else if (timeRange === 'hourly') {
          changePercentage = value.quote.USD.percent_change_1h;
        } else if (timeRange === '5m' || timeRange === '10m') {
          changePercentage = last24hPrice / 24; // Asumiendo que es un cambio promedio por hora
        }

        setPriceChange(changePercentage);

      } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
      }
    };

    //FUNCION PARA OBTENER LAS INVERSIONES DEL USUARIO
    const fetchInvestmentData = async () => {
      try {
        const { data, error } = await supabase
          .from('acciones')
          .select('*')
          .eq('iduser', userId)
          .eq('idcrypto', cryptocurrencyId);

        if (error) {
          console.error('Error fetching investment data:', error);
          return;
        }

        let totalInvested = 0;
        let totalCrypto = 0;

        data.forEach(row => {
          totalInvested += row.invertido;
          totalCrypto += row.cantcrypto;
        });

        setInvested(totalInvested);
        setValue(totalCrypto * currentPrice);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchChartData();
    fetchCryptoData();
    fetchInvestmentData();
  }, [cryptocurrencyId, timeRange, userId, currentPrice]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  //FUNCION PARA CALCULAR LAS GANANCIAS
  const calculateResult = () => {
    const result = value - invested;
    const percentage = (result / invested) * 100;
    return { result, percentage };
  };

  //FUNCIONES PARA CAMBIAR EL COLOR DEL BOTON DE LOS TIEMPOS DEL GRAFICO
  const getButtonStyle = (rangeKey) => {
    return {
      padding: 10,
      backgroundColor: timeRange === rangeKey ? '#007bff' : '#ddd',
      borderRadius: 5,
      marginHorizontal: 5,
    };
  };
  const getButtonTextStyle = (rangeKey) => {
    return {
      color: timeRange === rangeKey ? 'white' : 'black',
    };
  };

  //FUNCIONES ABRIR Y CERRAR EL MODAL DE INVERTIR
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setInvestmentAmount('');
  };

  //FUNCION ABRIR Y CERRAR EL MODAL DE RETIRAR
  const openWithdrawModal = () => {
    setIsWithdrawModalVisible(true);
  };
  
  const closeWithdrawModal = () => {
    setIsWithdrawModalVisible(false);
    setWithdrawalAmount('');
  };  

  //FUNCION COMPROBAR QUE AL DAR CLIC EN INVERTIR SOLO SE PONGAN NUMEROS CON REGEX
  const handleInvestmentChange = (amount) => {
    // Validar que solo se ingresen números
    const regex = /^[0-9\b]+$/;
    if (amount === '' || regex.test(amount)) {
      setInvestmentAmount(amount);
    }
  };

  //FUNCION COMPROBAR QUE AL DAR CLIC EN RETIRAR SOLO SE PONGAN NUMEROS CON REGEX
  const handleWithdrawalChange = (amount) => {
    // Validar que solo se ingresen números y que no sea mayor que el valor actual
    const regex = /^[0-9\b]+$/;
    if (amount === '' || (regex.test(amount) && parseFloat(amount) <= value)) {
      setWithdrawalAmount(amount);
    }
  };
  

  //FUNCION AL DAR CLIC EN INVERTIR
  const handleInvest = async () => {
    if (investmentAmount.trim() === '') {
      alert('Por favor ingrese un dinero válido para la inversión.');
      return;
    }
    const amount = parseFloat(investmentAmount);
    const cryptoAmount = amount / currentPrice;

    //Aquí puedes realizar la lógica para guardar la inversión en Supabase
    try {
      const { data, error } = await supabase.from('acciones').insert([
        {
          iduser: userId,
          idcrypto: cryptocurrencyId,
          cantcrypto: cryptoAmount,
          invertido: amount,
          tipo: 'invertir',
        },
      ]);

      if (error) {
        console.error('Error inserting investment:', error);
        alert('Error al guardar la inversión. Por favor, inténtelo de nuevo.');
      } else {
        // Actualizar el estado con los nuevos valores de inversión
        setInvested(prev => prev + amount);
        setValue(prev => prev + (cryptoAmount * currentPrice));
        closeModal();
        alert('Investment successfully completed');
      }
    } catch (error) {
      console.error('Unexpected error inserting investment:', error);
      alert('Error inesperado al guardar la inversión. Por favor, inténtelo de nuevo.');
    }
  };

  //FUNCINO AL DAR CLIC EN RETIRAR
  const handleWithdraw = async () => {
    if (withdrawalAmount.trim() === '') {
      alert('Por favor ingrese un dinero válido para retirar.');
      return;
    }
    const amount = parseFloat(withdrawalAmount);
    const cryptoAmount = amount / currentPrice;
  
    try {
      const { data, error } = await supabase.from('acciones').insert([
        {
          iduser: userId,
          idcrypto: cryptocurrencyId,
          cantcrypto: -cryptoAmount,
          invertido: -amount,
          tipo: 'retirar',
        },
      ]);
  
      if (error) {
        console.error('Error inserting withdrawal:', error);
        alert('Error al procesar el retiro. Por favor, inténtelo de nuevo.');
      } else {
        setInvested(prev => prev - amount);
        setValue(prev => prev - (cryptoAmount * currentPrice));
        closeWithdrawModal();
        alert('Retreat successfully completed');
      }
    } catch (error) {
      console.error('Unexpected error inserting withdrawal:', error);
      alert('Error inesperado al procesar el retiro. Por favor, inténtelo de nuevo.');
    }
  };
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#25142d'}}>

      {/* FLECHA PARA VOLVER ATRAS */}
      <TouchableOpacity
        style={{ position: 'absolute', left: 20, top: 40 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* LOGO Y NOMBRE */}
      {cryptoInfo && cryptoInfo.logo && (
        <Image source={{ uri: cryptoInfo.logo }} style={{ width: 100, height: 100 }} />
      )}
      {cryptoInfo && <Text style={{ fontSize: 24, color: 'white', marginBottom: 10 }}>{cryptoInfo.name}</Text>}

      {/* BOTONES */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 }}>
        {Object.keys(timeRanges).map(rangeKey => (
          <TouchableOpacity key={rangeKey} onPress={() => handleTimeRangeChange(rangeKey)}>
            <View style={getButtonStyle(rangeKey)}>
              <Text style={getButtonTextStyle(rangeKey)}>{rangeKey}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* GRAFICO */}
      {chartData && (
        <LineChart
          data={chartData}
          width={370}
          height={250}
          chartConfig={{
            backgroundColor: '#ffffff', // Cambia el color de fondo del gráfico
            backgroundGradientFrom: '#ffffff', // Cambia el color de gradiente de fondo del gráfico
            backgroundGradientTo: '#ffffff', // Cambia el color de gradiente de fondo del gráfico
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cambia el color de las líneas y etiquetas
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cambia el color de las etiquetas
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' }
          }}
        />
      )}

      {/* PRECIO ACTUAL */}
      {currentPrice !== null && priceChange !== null && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'white' }}>Current price: ${currentPrice.toFixed(2)}</Text>
          <Text style={{ fontSize: 18, color: priceChange >= 0 ? 'green' : 'red' }}>
            Cambio en las {timeRanges[timeRange].label}: {priceChange.toFixed(2)}%
          </Text>
        </View>
      )}

      {/* LINEA DE SEPARACIÖN */}
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: 10, width: 350, marginTop: 20, backgroundColor: 'white', height: 2}}>
      </View>

      {/* INVERTIDO Y VALOR*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, marginTop: 10}}>
      <Text style={{ fontSize: 18, marginLeft: 40, color: 'white' }}>Invested: €{invested.toFixed(2)}</Text>
      <Text style={{ fontSize: 18, marginRight: 40, color: 'white' }}>Value: €{value.toFixed(2)}</Text>
      </View>

      {/* RESULTADO */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
      <Text style={{ fontSize: 18, color: 'white' }}>
        Outcome: €{calculateResult().result.toFixed(2)} ({calculateResult().percentage.toFixed(2)}%)
      </Text>
      </View>

      {/* BOTONES INVERTIR Y RETIRAR */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop:20, marginBottom: 20 }}>
      <Button color="green" title="Invest" onPress={openModal} />
      <Button color="grey" title="Withdraw" onPress={openWithdrawModal} />
      </View>

      {/* MODAL DE INVERTIR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Deposit money to invest:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, flex: 1 }}
                keyboardType="numeric"
                value={investmentAmount}
                onChangeText={handleInvestmentChange}
              />
              <Text style={{ fontSize: 20 }}> $</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button color="green" title="Accept" onPress={handleInvest} />
              <Button color="red" title="Cancel" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE RETIRAR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isWithdrawModalVisible}
        onRequestClose={closeWithdrawModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter money to be withdrawn:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, flex: 1 }}
            keyboardType="numeric"
            value={withdrawalAmount}
            onChangeText={handleWithdrawalChange}
          />

            <Text style={{ fontSize: 20 }}> $</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button color="green" title="Accept" onPress={handleWithdraw} />
            <Button color="red" title="Cancel" onPress={closeWithdrawModal} />
          </View>
        </View>
      </View>

      </Modal>


      {/* NAVBAR */}
      <NavBar />

    </View>


  );
}

