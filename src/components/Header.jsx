import React from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, Plus } from 'lucide-react';

const FEATURED_POKEMON = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
  { id: 5, name: 'Charmeleon' },
  { id: 6, name: 'Charizard' },
  
];

export const Header = ({
  currentPokemonId,
  onPokemonSelect,
  searchTerm,
  onSearchChange,
  darkMode,
  onDarkModeToggle,
  onCreateClick,
}) => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full p-6 backdrop-blur-sm bg-white/10 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white"
            >
              Pokédex
            </motion.h1>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4">
            {FEATURED_POKEMON.map((pokemon) => (
              <motion.button
                key={pokemon.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPokemonSelect(pokemon.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentPokemonId === pokemon.id
                    ? 'bg-white text-green-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {pokemon.name}
              </motion.button>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateClick}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Créer
            </motion.button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 w-48"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDarkModeToggle}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};