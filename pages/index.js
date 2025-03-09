import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import CategorySelector from "../components/CategorySelector";

export default function Home() {
  const [countdowns, setCountdowns] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    color: "#3B82F6",
    id: "",
    category: "未分类", // 默认分类
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [categories, setCategories] = useState(["未分类"]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 从本地存储加载倒计时事件
  useEffect(() => {
    const savedCountdowns = localStorage.getItem("countdowns");
    if (savedCountdowns) {
      const parsedCountdowns = JSON.parse(savedCountdowns);
      setCountdowns(parsedCountdowns);

      // 提取所有分类
      const allCategories = new Set(["未分类"]);
      parsedCountdowns.forEach((item) => {
        if (item.category) {
          allCategories.add(item.category);
        }
      });
      setCategories(Array.from(allCategories));
    }
  }, []);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 保存倒计时事件到本地存储
  useEffect(() => {
    if (countdowns.length > 0) {
      localStorage.setItem("countdowns", JSON.stringify(countdowns));
    }
  }, [countdowns]);

  // 添加新的倒计时事件
  const addCountdown = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date) {
      const newCountdown = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setCountdowns([...countdowns, newCountdown]);
      setNewEvent({
        title: "",
        date: "",
        color: "#3B82F6",
        id: "",
        category: newEvent.category, // 保持当前选择的分类
      });
    }
  };

  // 删除倒计时事件
  const deleteCountdown = (id) => {
    const updatedCountdowns = countdowns.filter(
      (countdown) => countdown.id !== id
    );
    setCountdowns(updatedCountdowns);
    if (updatedCountdowns.length === 0) {
      localStorage.removeItem("countdowns");
    }
  };

  // 添加新分类
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // 过滤显示的倒计时
  const filteredCountdowns =
    selectedCategory === "all"
      ? countdowns
      : countdowns.filter(
          (countdown) => countdown.category === selectedCategory
        );

  // 导出数据为JSON文件
  const exportData = () => {
    if (countdowns.length === 0) {
      alert("没有数据可导出！");
      return;
    }

    const dataStr = JSON.stringify(countdowns, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `countdowns-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // 文件输入引用
  const fileInputRef = useRef(null);

  // 触发文件选择
  const triggerImport = () => {
    fileInputRef.current.click();
  };

  // 导入数据
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // 验证导入的数据格式
        if (!Array.isArray(importedData)) {
          throw new Error("导入的数据格式不正确！");
        }

        // 验证每个倒计时项是否有必要的字段
        const isValid = importedData.every(
          (item) => item.id && item.title && item.date && item.color
        );

        if (!isValid) {
          throw new Error("导入的数据缺少必要的字段！");
        }

        // 确认是否覆盖或合并现有数据
        if (countdowns.length > 0) {
          const confirmAction = window.confirm(
            '是否要合并导入的数据与现有数据？\n\n点击"确定"合并数据\n点击"取消"替换现有数据'
          );

          if (confirmAction) {
            // 合并数据，避免ID重复
            const existingIds = new Set(countdowns.map((item) => item.id));
            const newItems = importedData.filter(
              (item) => !existingIds.has(item.id)
            );
            setCountdowns([...countdowns, ...newItems]);
          } else {
            // 替换现有数据
            setCountdowns(importedData);
          }
        } else {
          // 没有现有数据，直接设置
          setCountdowns(importedData);
        }

        alert("数据导入成功！");
      } catch (error) {
        alert(`导入失败: ${error.message}`);
      }

      // 重置文件输入
      event.target.value = null;
    };

    reader.readAsText(file);
  };

  // 计算剩余时间
  const calculateTimeLeft = (targetDate) => {
    const difference = new Date(targetDate) - currentTime;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 animate-fade-in">
      <Head>
        <title>倒计时 | Days Matter</title>
        <meta name="description" content="倒计时应用 - 记录重要日子" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            倒计时 Days Matter
          </h1>
        </div>

        {/* 导入导出按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            导出数据
          </button>
          <button
            onClick={triggerImport}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            导入数据
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importData}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* 分类选择器 */}
        <CategorySelector
          categories={categories}
          events={countdowns}
          setEvents={setCountdowns}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={addCategory}
          setCategories={setCategories}
        />

        {/* 添加新倒计时表单 */}
        <div className="bg-white shadow-card p-8 rounded-xl mb-10 transform transition-all duration-300 hover:shadow-card-hover">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            添加新倒计时
          </h2>
          <form onSubmit={addCountdown} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                事件名称
              </label>
              <input
                type="text"
                id="title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="form-input"
                placeholder="输入事件名称"
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                目标日期
              </label>
              <input
                type="date"
                id="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="form-input"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                分类
              </label>
              <select
                id="category"
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, category: e.target.value })
                }
                className="form-input"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                颜色标记
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  id="color"
                  value={newEvent.color}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, color: e.target.value })
                  }
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-500">
                  选择一个颜色来标记您的事件
                </span>
              </div>
            </div>
            <button type="submit" className="btn-primary mt-2">
              添加倒计时
            </button>
          </form>
        </div>

        {/* 倒计时列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCountdowns.map((countdown) => {
            const timeLeft = calculateTimeLeft(countdown.date);
            return (
              <div
                key={countdown.id}
                className="countdown-card animate-fade-in bg-white"
                style={{ borderTop: `4px solid ${countdown.color}` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {countdown.title}
                    </h3>
                    <button
                      onClick={() => deleteCountdown(countdown.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                      aria-label="删除倒计时"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 00-1 1v1a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500 mb-2">
                      目标日期: {new Date(countdown.date).toLocaleDateString()}
                    </div>

                    {timeLeft.isPast ? (
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-gray-600 font-medium">
                          已经到达目标日期
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-center">
                          <div className="countdown-number">
                            {timeLeft.days}
                          </div>
                          <div className="text-xs text-gray-500">天</div>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-lg text-center">
                          <div className="countdown-number">
                            {timeLeft.hours}
                          </div>
                          <div className="text-xs text-gray-500">时</div>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-lg text-center">
                          <div className="countdown-number">
                            {timeLeft.minutes}
                          </div>
                          <div className="text-xs text-gray-500">分</div>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-lg text-center">
                          <div className="countdown-number">
                            {timeLeft.seconds}
                          </div>
                          <div className="text-xs text-gray-500">秒</div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500">
                      分类:{" "}
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {countdown.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
