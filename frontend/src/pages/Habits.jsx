import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  CheckCircle, 
  Edit, 
  Trash2, 
  TrendingUp,
  X,
  Zap
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { habitAPI } from '../services/api';
import './Habits.css';

const CATEGORIES = [
  { value: 'all', label: 'Todos', color: '#6366f1' },
  { value: 'Saúde', label: 'Saúde', color: '#10b981' },
  { value: 'Estudos', label: 'Estudos', color: '#3b82f6' },
  { value: 'Trabalho', label: 'Trabalho', color: '#f59e0b' },
  { value: 'Fitness', label: 'Fitness', color: '#ef4444' },
  { value: 'Mindfulness', label: 'Mindfulness', color: '#8b5cf6' },
  { value: 'Social', label: 'Social', color: '#ec4899' },
  { value: 'Outros', label: 'Outros', color: '#64748b' }
];

const FREQUENCIES = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' }
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil', xp: 10, color: '#10b981' },
  { value: 'medium', label: 'Médio', xp: 20, color: '#f59e0b' },
  { value: 'hard', label: 'Difícil', xp: 30, color: '#ef4444' }
];

const ICONS = ['📚', '💪', '🎯', '🧘', '🏃', '💻', '🎨', '🎵', '📝', '🌱', '☕', '🌟'];

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Saúde',
    frequency: 'daily',
    difficulty: 'medium',
    goal: 1,
    color: '#10b981',
    icon: '📚'
  });

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    filterHabits();
  }, [habits, selectedCategory, searchTerm]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await habitAPI.getAll({ isActive: true });
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHabits = () => {
    let filtered = habits;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(habit => habit.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(habit =>
        habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHabits(filtered);
  };

  const handleOpenModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        title: habit.title,
        description: habit.description || '',
        category: habit.category,
        frequency: habit.frequency,
        difficulty: habit.difficulty,
        goal: habit.goal,
        color: habit.color,
        icon: habit.icon
      });
    } else {
      setEditingHabit(null);
      setFormData({
        title: '',
        description: '',
        category: 'Saúde',
        frequency: 'daily',
        difficulty: 'medium',
        goal: 1,
        color: '#10b981',
        icon: '📚'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHabit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      if (editingHabit) {
        await habitAPI.update(editingHabit.id, formData);
      } else {
        await habitAPI.create(formData);
      }
      
      handleCloseModal();
      loadHabits();
    } catch (error) {
      console.error('Erro ao salvar hábito:', error);
      alert('Erro ao salvar hábito. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (habitId) => {
    try {
      await habitAPI.complete(habitId);
      loadHabits();
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Tem certeza que deseja excluir este hábito?')) {
      try {
        await habitAPI.delete(habitId);
        loadHabits();
      } catch (error) {
        console.error('Erro ao deletar hábito:', error);
      }
    }
  };

  return (
    <MainLayout 
      title="Meus Hábitos" 
      subtitle="Gerencie e acompanhe seus hábitos diários"
    >
      <div className="habits-page">
        {/* Barra de Filtros e Ações */}
        <motion.div 
          className="habits-toolbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="toolbar-left">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar hábitos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-right">
            <Button 
              variant="primary" 
              icon={<Plus size={20} />}
              onClick={() => handleOpenModal()}
            >
              Novo Hábito
            </Button>
          </div>
        </motion.div>

        {/* Filtros por Categoria */}
        <motion.div 
          className="category-filters"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              className={`category-chip ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
              style={{
                '--category-color': category.color
              }}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Grid de Hábitos */}
        {loading ? (
          <div className="habits-loading">
            <div className="spinner"></div>
          </div>
        ) : filteredHabits.length > 0 ? (
          <motion.div 
            className="habits-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="habit-card" hover>
                  <div className="habit-card-header">
                    <div 
                      className="habit-card-icon"
                      style={{ background: habit.color }}
                    >
                      {habit.icon}
                    </div>
                    <div className="habit-card-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleOpenModal(habit)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn action-btn-danger"
                        onClick={() => handleDelete(habit.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="habit-card-content">
                    <h3 className="habit-card-title">{habit.title}</h3>
                    {habit.description && (
                      <p className="habit-card-description">{habit.description}</p>
                    )}

                    <div className="habit-card-meta">
                      <span className="meta-badge meta-category">
                        {habit.category}
                      </span>
                      <span className="meta-badge meta-frequency">
                        {FREQUENCIES.find(f => f.value === habit.frequency)?.label}
                      </span>
                      <span className="meta-badge meta-xp">
                        <Zap size={14} />
                        +{habit.xpReward} XP
                      </span>
                    </div>

                    <div className="habit-card-stats">
                      <div className="stat">
                        <TrendingUp size={16} />
                        <span>{habit._count?.completions || 0} conclusões</span>
                      </div>
                    </div>
                  </div>

                  <div className="habit-card-footer">
                    <Button
                      variant="success"
                      fullWidth
                      icon={<CheckCircle size={18} />}
                      onClick={() => handleComplete(habit.id)}
                    >
                      Concluir Hoje
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="habits-empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-icon">🎯</div>
            <h3>Nenhum hábito encontrado</h3>
            <p>
              {searchTerm || selectedCategory !== 'all' 
                ? 'Tente ajustar os filtros' 
                : 'Comece criando seu primeiro hábito!'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button 
                variant="primary" 
                icon={<Plus size={20} />}
                onClick={() => handleOpenModal()}
              >
                Criar Hábito
              </Button>
            )}
          </motion.div>
        )}

        {/* Modal de Criação/Edição */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
              />
              <motion.div
                className="modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <div className="modal-header">
                  <h2>{editingHabit ? 'Editar Hábito' : 'Novo Hábito'}</h2>
                  <button className="modal-close" onClick={handleCloseModal}>
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-content">
                    <div className="form-group">
                      <Input
                        label="Título do Hábito"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Meditar 10 minutos"
                        required
                        autoFocus
                        className="modal-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descrição (opcional)</label>
                      <textarea
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Adicione mais detalhes sobre o hábito..."
                        rows={3}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Categoria</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => {
                            const category = CATEGORIES.find(c => c.value === e.target.value);
                            setFormData({ 
                              ...formData, 
                              category: e.target.value,
                              color: category?.color || '#6366f1'
                            });
                          }}
                        >
                          {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Frequência</label>
                        <select
                          className="form-select"
                          value={formData.frequency}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        >
                          {FREQUENCIES.map(freq => (
                            <option key={freq.value} value={freq.value}>
                              {freq.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dificuldade</label>
                      <div className="difficulty-selector">
                        {DIFFICULTIES.map(diff => (
                          <button
                            key={diff.value}
                            type="button"
                            className={`difficulty-btn ${formData.difficulty === diff.value ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                            style={{ '--difficulty-color': diff.color }}
                          >
                            <span className="difficulty-label">{diff.label}</span>
                            <span className="difficulty-xp">+{diff.xp} XP</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ícone</label>
                      <div className="icon-selector">
                        {ICONS.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            className={`icon-btn ${formData.icon === icon ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, icon })}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <Button variant="ghost" type="button" onClick={handleCloseModal}>
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit" loading={submitting}>
                      {editingHabit ? 'Salvar Alterações' : 'Criar Hábito'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Habits;