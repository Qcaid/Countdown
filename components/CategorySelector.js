import React, { useState } from 'react';

const CategorySelector = ({ categories, selectedCategory, onSelectCategory, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
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
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${selectedCategory === category 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;