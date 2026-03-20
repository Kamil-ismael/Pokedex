import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePokemon } from '../hooks/usePokemon';
import { Header } from '../components/Header';
import { CreatePokemonForm } from '../components/CreatePokemonForm';
import { PokemonCard } from '../components/PokemonCard';
import { NavigationButtons } from '../components/NavigationButtons';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getBackgroundGradient } from '../utils/pokemonUtils';

export const PokedexPage = () => {
  const [currentPokemonId, setCurrentPokemonId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customPokemonList, setCustomPokemonList] = useState([]);
  const { pokemon, loading, error } = usePokemon(currentPokemonId);

  const handlePokemonSelect = (id) => {
    setIsNavigating(true);
    setCurrentPokemonId(id);
  };

  const handleToggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    if (showCreateForm) {
      // Réinitialiser quand on ferme le formulaire
      setIsNavigating(false);
    }
  };

  const handleCreatePokemon = (newPokemon) => {
    // Ajouter le nouveau Pokémon à la liste
    setCustomPokemonList([...customPokemonList, newPokemon]);
    setShowCreateForm(false);
  };

  const handlePrevious = () => {
    if (currentPokemonId > 1) {
      setIsNavigating(true);
      setCurrentPokemonId(currentPokemonId - 1);
    }
  };

  const handleNext = () => {
    if (currentPokemonId < 1010) {
      setIsNavigating(true);
      setCurrentPokemonId(currentPokemonId + 1);
    }
  };

  const handleSearch = async (term) => {
    if (term.trim() === '') return;
    
    try {
      setIsNavigating(true);
      const searchValue = term.toLowerCase().trim();
      const isNumeric = /^\d+$/.test(searchValue);
      
      if (isNumeric) {
        const id = parseInt(searchValue);
        if (id >= 1 && id <= 1010) {
          setCurrentPokemonId(id);
        }
      } else {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentPokemonId(data.id);
        }
      }
      setSearchTerm('');
    } catch (error) {
      console.error('Search failed:', error);
      setIsNavigating(false);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (term.trim() === '') {
      return;
    }
    
    const newTimeout = setTimeout(() => {
      handleSearch(term);
    }, 2000);
    
    setSearchTimeout(newTimeout);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (currentPokemonId > 1) {
          setIsNavigating(true);
          setCurrentPokemonId(currentPokemonId - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentPokemonId < 1010) {
          setIsNavigating(true);
          setCurrentPokemonId(currentPokemonId + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPokemonId]);

  useEffect(() => {
    if (!loading && pokemon) {
      setIsNavigating(false);
    }
  }, [loading, pokemon]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
  
  const getBackgroundClass = () => {
    if (darkMode) {
      return 'bg-gradient-to-br from-gray-900 via-gray-800 to-black';
    }
    
    if (pokemon && pokemon.types && pokemon.types.length > 0) {
      const primaryType = pokemon.types[0].type.name;
      return `bg-gradient-to-br ${getBackgroundGradient(primaryType)}`;
    }
    
    return 'bg-gradient-to-br from-gray-500 via-gray-600 to-black';
  };
  
  const backgroundClass = getBackgroundClass();

  if (loading || isNavigating) {
    return (
      <div className={`min-h-screen ${backgroundClass}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={`min-h-screen ${backgroundClass}`}>
        <ErrorMessage 
          message={error || 'Pokemon not found'} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${backgroundClass} transition-all duration-700`}
      onKeyDown={handleKeyPress}
    >
      <Header
        currentPokemonId={currentPokemonId}
        onPokemonSelect={handlePokemonSelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onCreateClick={handleToggleCreateForm}
      />

      <main className="relative px-6 py-12">
        {showCreateForm ? (
          <CreatePokemonForm 
            onCreatePokemon={handleCreatePokemon}
            onCancel={handleToggleCreateForm}
          />
        ) : (
          <>
            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoPrevious={currentPokemonId > 1}
              canGoNext={currentPokemonId < 1010}
            />

            <PokemonCard pokemon={pokemon} />

            {customPokemonList.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Mes Pokémons créés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customPokemonList.map((customPokemon) => (
                    <motion.div
                      key={customPokemon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-6 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={customPokemon.imageUrl} 
                          alt={customPokemon.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{customPokemon.name}</h3>
                          <p className="text-sm text-white/70 capitalize">{customPokemon.type}</p>
                          <div className="mt-2 space-y-1 text-sm text-white/80">
                            <p>PV: {customPokemon.hp}</p>
                            <p>Attaque: {customPokemon.attack}</p>
                            <p>Défense: {customPokemon.defense}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
};