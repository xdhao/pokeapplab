import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, TextInput, Dimensions, Button } from "react-native";
import { pokeAPI } from "../../services/pokeAPI";
import { PokemonShortInfo } from "../../types/Pokemon";
import { Pokemon } from "./components/Pokemon";
import { EvilIcons } from '@expo/vector-icons'; 
import Toast from 'react-native-toast-message';

export const Pokemons: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonShortInfo[]>([]);
  const [pokeName, setPokeName] = useState('');

  async function getPokemons(pokeName: string) {
    var success = false;
    try {
      const pokemons = await pokeAPI.getPokemons();
      if (pokeName){
        for (var search in pokemons){
          if (pokeName == pokemons[search].name){
            setPokemons(pokemons.slice(Number(search), Number(search)+1));
            success = true;
          }
          if (Number(search) == (pokemons.length-1) && !success){        
            Toast.show({
              type: 'error',
              text1: 'Ошибка',
              text2: 'Не найдено совпадений'
            });           
          }
        } 
      }
      else {
        setPokemons(pokemons);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    var emptyname = '';
    getPokemons(emptyname);
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokeapp</Text>
      <View style={styles.searchBar}>
        <TextInput 
            placeholder="Pokemon search"
            value={pokeName}
            onChangeText={(text) => setPokeName(text)}
        />
        <EvilIcons name="search" size={28} color="black" onPress={() => getPokemons(pokeName)}/>
      </View>
      <FlatList
        data={pokemons}
        // ! Привет костыль, неудобство во внешнем ресурсе
        renderItem={({ item }) => (         
          <Pokemon index={Number(item.url.split("/")[6])} data={item} />
        )}
        style={styles.list}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  list: {
    padding: 16,
    marginTop: 16,
  },
  searchBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width - 20,
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderColor: 'black'
}
});
