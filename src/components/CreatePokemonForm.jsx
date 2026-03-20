import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const CreatePokemonForm = ({ onCreatePokemon, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'normal',
    hp: '',
    attack: '',
    defense: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.hp || parseInt(formData.hp) <= 0 || parseInt(formData.hp) > 999) {
      newErrors.hp = 'Les PV doivent être entre 1 et 999';
    }

    if (!formData.attack || parseInt(formData.attack) <= 0 || parseInt(formData.attack) > 255) {
      newErrors.attack = "L'attaque doit être entre 1 et 255";
    }

    if (!formData.defense || parseInt(formData.defense) <= 0 || parseInt(formData.defense) > 255) {
      newErrors.defense = 'La défense doit être entre 1 et 255';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "L'URL de l'image est requis";
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.imageUrl)) {
      newErrors.imageUrl = "L'URL doit être une image valide (jpg, png, gif, webp)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ si l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newPokemon = {
      id: Date.now(), // ID unique basé sur le timestamp
      name: formData.name.trim(),
      type: formData.type,
      hp: parseInt(formData.hp),
      attack: parseInt(formData.attack),
      defense: parseInt(formData.defense),
      imageUrl: formData.imageUrl,
      isCustom: true // Marquer comme Pokémon créé par l'utilisateur
    };

    onCreatePokemon(newPokemon);

    // Afficher le message de succès
    setSuccessMessage(`🎉 ${newPokemon.name} a été créé avec succès!`);

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      type: 'normal',
      hp: '',
      attack: '',
      defense: '',
      imageUrl: ''
    });

    // Fermer le formulaire après 2 secondes
    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <div className="backdrop-blur-sm bg-white/10 border border-white/30 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Créer un nouveau Pokémon
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-center"
          >
            {successMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nom du Pokémon
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Pikachu"
              className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                errors.name ? 'border-red-500' : 'border-white/30'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
            >
              {POKEMON_TYPES.map(type => (
                <option key={type} value={type} className="bg-gray-800">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Grille pour PV, Attaque, Défense */}
          <div className="grid grid-cols-3 gap-4">
            {/* PV */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                PV (HP)
              </label>
              <input
                type="number"
                name="hp"
                value={formData.hp}
                onChange={handleChange}
                placeholder="1-999"
                min="1"
                max="999"
                className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                  errors.hp ? 'border-red-500' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
              />
              {errors.hp && (
                <p className="mt-1 text-xs text-red-400">{errors.hp}</p>
              )}
            </div>

            {/* Attaque */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Attaque
              </label>
              <input
                type="number"
                name="attack"
                value={formData.attack}
                onChange={handleChange}
                placeholder="1-255"
                min="1"
                max="255"
                className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                  errors.attack ? 'border-red-500' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
              />
              {errors.attack && (
                <p className="mt-1 text-xs text-red-400">{errors.attack}</p>
              )}
            </div>

            {/* Défense */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Défense
              </label>
              <input
                type="number"
                name="defense"
                value={formData.defense}
                onChange={handleChange}
                placeholder="1-255"
                min="1"
                max="255"
                className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                  errors.defense ? 'border-red-500' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
              />
              {errors.defense && (
                <p className="mt-1 text-xs text-red-400">{errors.defense}</p>
              )}
            </div>
          </div>

          {/* URL Image */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/pokemon.png"
              className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                errors.imageUrl ? 'border-red-500' : 'border-white/30'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors`}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Créer le Pokémon
            </motion.button>
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/30"
            >
              Annuler
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
