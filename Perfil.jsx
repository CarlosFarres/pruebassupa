import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import { supabase } from './supabase';
import NavBar from './MainContainer';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

const Perfil = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [username, setUsername] = useState('');
  const [wallet, setWallet] = useState('');
  const [investments, setInvestments] = useState([]);
  const navigation = useNavigation();
  const { userId } = useUser();

  useEffect(() => {
    updateDateTime();
    const timerID = setInterval(() => updateDateTime(), 1000);
      supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching data:', error);
          } else if (data) {
            setUsername(data.name);
          } else {
            console.error('No se encontraron datos');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });

      // Fetch user's investments
      supabase
        .from('acciones')
        .select('idcrypto, cantcrypto, invertido')
        .eq('iduser', userId)
        .then(async ({ data, error }) => {
          if (error) {
            console.error('Error fetching investments:', error);
          } else if (data) {
            const investmentSummary = data.reduce((acc, item) => {
              if (!acc[item.idcrypto]) {
                acc[item.idcrypto] = { totalCantCrypto: 0, totalInvertido: 0, currentPrice: 0, logo: '', name: '' };
              }
              acc[item.idcrypto].totalCantCrypto += parseFloat(item.cantcrypto);
              acc[item.idcrypto].totalInvertido += parseFloat(item.invertido);
              return acc;
            }, {});

            const cryptoIds = Object.keys(investmentSummary);

            // Fetch current prices and info from CoinMarketCap
            const apiKey = 'df0e96ea-ff39-444e-8158-cb8354f7f3a4';
            const promises = cryptoIds.map(async idcrypto => {
              // Fetch current price
              const valueResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${idcrypto}&CMC_PRO_API_KEY=${apiKey}`);
              const valueData = await valueResponse.json();
              const value = valueData.data[idcrypto].quote.USD.price;

              // Fetch crypto info (logo and name)
              const infoResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${idcrypto}&CMC_PRO_API_KEY=${apiKey}`);
              const infoData = await infoResponse.json();
              const info = infoData.data[idcrypto];
              const logo = info.logo;
              const name = info.name;

              return { idcrypto, value, logo, name };
            });

            Promise.all(promises)
              .then(results => {
                results.forEach(({ idcrypto, value, logo, name }) => {
                  investmentSummary[idcrypto].currentPrice = value;
                  investmentSummary[idcrypto].logo = logo;
                  investmentSummary[idcrypto].name = name;
                });

                const uniqueInvestments = cryptoIds.map(idcrypto => ({
                  idcrypto,
                  ...investmentSummary[idcrypto]
                }));

                // Update investments state
                setInvestments(uniqueInvestments);

                // Calculate wallet total
                const walletTotal = uniqueInvestments.reduce((acc, { totalCantCrypto, currentPrice }) => {
                  const currentValue = totalCantCrypto * currentPrice;
                  return acc + currentValue;
                }, 0);

                // Set wallet state
                setWallet(walletTotal.toFixed(2));
              })
              .catch(error => {
                console.error('Error fetching data:', error);
              });
          } else {
            console.error('No se encontraron datos de inversiones');
          }
        })
        .catch((error) => {
          console.error('Error fetching investments:', error);
        });
    

    return () => clearInterval(timerID);
  }, [userId]);

  const updateDateTime = () => {
    const now = moment().format('MMMM Do YYYY, h:mm:ss a');
    setCurrentDateTime(now);
  };

  const handleInvestmentPress = (idcrypto) => {
    navigation.navigate('DetailsScreen', { cryptocurrencyId: idcrypto });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nombrePagina}>Profile</Text>
      <View style={styles.dividerPerfil} />
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('./assets/user.png')} // Ajusta la ruta a la ubicación de tu imagen
        />
        <View style={styles.userInfo}>
          <Text style={styles.newBoxTextName}>{username}</Text>
          <Text style={styles.newBoxText}>Wallet: {wallet}$</Text>
          <Text style={styles.newBoxText}>{currentDateTime}</Text>
        </View>

      </View>
      <View style={styles.boxInves}>
        <Text style={styles.boxInvesText}>Investments</Text>
        <View style={styles.divider} />
      </View>
      <ScrollView style={{ marginBottom: 60 }}>
        {investments.map(({ idcrypto, totalCantCrypto, totalInvertido, currentPrice, logo, name }) => (
          <TouchableOpacity key={idcrypto} style={styles.newBox} onPress={() => handleInvestmentPress(idcrypto)}>
            <View style={styles.cryptoHeader}>
              <Image
                style={styles.cryptoLogo}
                source={{ uri: logo }}
              />
              <Text style={styles.cryptoName}>{name}</Text>
            </View>
            <Text style={styles.newBoxText}>
              Quantity: {totalCantCrypto.toFixed(4)}$
            </Text>
            <Text style={styles.newBoxText}>
              Actual Price: {currentPrice.toFixed(2)}$
            </Text>
            <Text style={styles.newBoxText}>
             Total Invested: {totalInvertido.toFixed(2)}$
            </Text>
            <Text style={styles.newBoxText}>
             Total Value: {(totalCantCrypto * currentPrice).toFixed(2)}$
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25142d',
  },
  header: {
    flexDirection: 'row',
    //backgroundColor: 'silver',
    marginTop: 30,
    padding: 20,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1, // Aprovecha el espacio disponible en el contenedor
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nombrePagina: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  boxInves: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  boxInvesText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    backgroundColor: 'white',
    height: 5,
  },
  dividerPerfil: {
    backgroundColor: 'white',
    height: 5,
    marginHorizontal: 40,
  },
  newBox: {
    //backgroundColor: 'silver',
    borderWidth: 1, // Ancho del borde
    borderColor: 'white', // Color del borde
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 20,
    marginTop: 0,
    marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBoxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newBoxTextName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cryptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cryptoLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 15,
  },
  cryptoName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 70, // Ajusta el ancho según sea necesario
    height: 70, // Ajusta la altura según sea necesario
    marginRight: 20,
  },
  });
  
  export default Perfil;
  
