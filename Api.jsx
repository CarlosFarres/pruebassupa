import * as React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image} from 'react-native';
import NavBar from './MainContainer';

export default class Api extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            cryptocurrencies: [],
            url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=df0e96ea-ff39-444e-8158-cb8354f7f3a4'
        }
    }

    componentDidMount() {
        this.getCryptocurrencies();
    }

    getCryptocurrencies = () => {

        this.setState({ loading: true })

        fetch(this.state.url)
        .then(res => res.json())
        .then(res => {

                this.setState({
                    cryptocurrencies: res.data.slice(0, 30),
                    url: res.next,
                    loading: false
                })
            })
    };

   /*   handlePress = (item) => {
        this.props.navigation.push('DetailsScreen', { name: item.name });
    }   */

    handlePress = (item) => {
        this.props.navigation.push('DetailsScreen', { cryptocurrencyId: item.id });
    }
        

    render() {
        if (this.state.loading) {
            return (
                <ImageBackground 
                source={require('./assets/JMCTRADING.png')} 
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 900, width: 400 }}>
                <View style={styles.container}>
                    <Text style={{ color: 'white', fontSize: 35 }}>Loading Data...</Text>
                </View>
                </ImageBackground>
            );
        }

        return (
            <View 
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#25142d'}}>
                <View style={styles.cryptoBox}>
                    <Text style={styles.cryptoText}>Crypto</Text>
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.cryptocurrencies}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.handlePress(item)} style={{ marginBottom: 10 }}>
                                <View style={styles.itemContainer}>
                                <Image 
                                        source={{ uri: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png` }} 
                                        style={styles.logo}
                                    />
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemText}>{item.symbol}</Text>
                                    <Text style={styles.itemText}>Ranking: {item.rank}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingRight: 20 }}
                    />
                
                </View>
                <NavBar />
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 15,
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 20,
        marginBottom: 60,
    },
    cryptoBox: {
        position: 'absolute',
        top: 30,
        left: 50,
        right: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'black',
        //borderRadius: 5,
        //borderWidth: 1,
        //borderColor: 'white',
    },
    cryptoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        paddingHorizontal: 20,
        paddingVertical: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 0,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    itemName: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    itemText: {
        textAlign: 'center',
        color: 'yellow',
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'silver',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      },
      button: {
        backgroundColor: '#fff',
        width: 100,
        height: 50,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#f4511e',
        fontSize: 16,
        fontWeight: 'bold',
      },
      logo: {
        height: 30,
        width: 30,
      },
});