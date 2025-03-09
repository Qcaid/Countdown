import React, { useState } from 'react';

const CategorySelector = ({ categories, events, setEvents, selectedCategory, onSelectCategory, onAddCategory, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
  if (!events || !setEvents) return;
    if (window.confirm('确定要删除该分类吗？相关事件将移至未分类')) {
      // 迁移被删分类的事件到默认分类
      const updatedEvents = events.map(event => 
        event.category === categoryToDelete ? { ...event, category: '未分类' } : event
      );
      setEvents(updatedEvents);
      
      // 更新分类列表
      const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
      setCategories(updatedCategories);
      
      // 更新本地存储
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">分类筛选</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-200"
          >
            添加分类
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="输入新分类名称"
            className="form-input flex-grow text-sm"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-1 rounded text-white text-sm bg-green-500 hover:bg-green-600"
          >
            确认
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCategory('');
            }}
            className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${selectedCategory === 'all' 
            ? 'bg-indigo-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          全部
        </button>
        {categories.map((category) => (
  <div key={category} className="flex items-center gap-1 group">
    <button
      onClick={() => onSelectCategory(category)}
      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${selectedCategory === category 
        ? 'bg-indigo-500 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
      {category}
    </button>
    <button
      onClick={() => handleDeleteCategory(category)}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-1 hover:bg-red-100 rounded"
      title="删除分类"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
))}
      </div>
    </div>
  );
};

export default CategorySelector;