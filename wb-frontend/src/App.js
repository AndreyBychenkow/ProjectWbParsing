import React, { useEffect, useState } from "react";
import { Table, Slider, Row, Col } from "antd";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const columns = [
  {
    title: "Название товара",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
    render: (value) => `${value} ₽`,
  },
  {
    title: "Цена со скидкой",
    dataIndex: "sale_price",
    key: "sale_price",
    render: (value) => `${value} ₽`,
    sorter: (a, b) => a.sale_price - b.sale_price,
  },
  {
    title: "Рейтинг",
    dataIndex: "rating",
    key: "rating",
    sorter: (a, b) => a.rating - b.rating,
  },
  {
    title: "Количество отзывов",
    dataIndex: "feedback_count",
    key: "feedback_count",
    sorter: (a, b) => a.feedback_count - b.feedback_count,
  },
];

function getPriceHistogram(data, binSize = 1000) {
  if (!data.length) return [];
  const min = Math.floor(Math.min(...data.map(item => item.price)) / binSize) * binSize;
  const max = Math.ceil(Math.max(...data.map(item => item.price)) / binSize) * binSize;
  const bins = [];
  for (let start = min; start < max; start += binSize) {
    bins.push({
      range: `${start}–${start + binSize - 1}`,
      count: 0,
    });
  }
  data.forEach(item => {
    const idx = Math.floor((item.price - min) / binSize);
    if (bins[idx]) bins[idx].count += 1;
  });
  return bins;
}

function getDiscountVsRating(data) {
  
  return data
    .filter(item => item.price > 0 && item.sale_price > 0 && item.rating > 0)
    .map(item => ({
      rating: item.rating,
      discount: Math.round((1 - item.sale_price / item.price) * 100),
      name: item.name,
    }));
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [minFeedback, setMinFeedback] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        setData(res.data);
        setLoading(false);
        if (res.data.length) {
          const prices = res.data.map((item) => item.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch((err) => {
        setError("Ошибка загрузки данных");
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.price >= priceRange[0] &&
      item.price <= priceRange[1] &&
      item.rating >= minRating &&
      item.feedback_count >= minFeedback
  );

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Товары Wildberries</h2>
      <Row style={{ marginBottom: 24 }}>
        <Col span={8}>
          <div style={{ marginBottom: 8 }}>Цена:</div>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
            marks={{
              [minPrice]: `${minPrice}₽`,
              [maxPrice]: `${maxPrice}₽`,
            }}
          />
        </Col>
        <Col span={8} offset={2}>
          <div style={{ marginBottom: 8 }}>Минимальный рейтинг:</div>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={minRating}
            onChange={setMinRating}
            marks={{ 0: "0", 5: "5" }}
            style={{ width: 300 }}
          />
        </Col>
        <Col span={6}>
          <div style={{ marginBottom: 8 }}>Мин. отзывов:</div>
          <Slider
            min={0}
            max={Math.max(...data.map((item) => item.feedback_count), 1000)}
            step={1}
            value={minFeedback}
            onChange={setMinFeedback}
            marks={{
              0: "0",
              [Math.max(...data.map((item) => item.feedback_count), 1000)]: `${Math.max(...data.map((item) => item.feedback_count), 1000)}`
            }}
            style={{ width: 200, marginLeft: 24 }}
          />
        </Col>
      </Row>
      <h3>Гистограмма цен</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getPriceHistogram(filteredData, 1000)}>
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
      <h3 style={{ marginTop: 32 }}>Линейный график: Скидка (%) vs Рейтинг</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getDiscountVsRating(filteredData)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" type="number" domain={[0, 5]} />
          <YAxis dataKey="discount" type="number" domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="discount" stroke="#fa541c" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

export default App;
