import { useEffect, useRef, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const WEATHER_CODES = {
  0: { label: "맑음", icon: "ti-sun" },
  1: { label: "대체로 맑음", icon: "ti-sun" },
  2: { label: "부분적 흐림", icon: "ti-cloud" },
  3: { label: "흐림", icon: "ti-cloud" },
  45: { label: "안개", icon: "ti-mist" },
  48: { label: "안개", icon: "ti-mist" },
  51: { label: "가벼운 이슬비", icon: "ti-cloud-drizzle" },
  53: { label: "이슬비", icon: "ti-cloud-drizzle" },
  55: { label: "강한 이슬비", icon: "ti-cloud-drizzle" },
  61: { label: "약한 비", icon: "ti-cloud-rain" },
  63: { label: "비", icon: "ti-cloud-rain" },
  65: { label: "강한 비", icon: "ti-cloud-rain" },
  71: { label: "약한 눈", icon: "ti-snowflake" },
  73: { label: "눈", icon: "ti-snowflake" },
  75: { label: "강한 눈", icon: "ti-snowflake" },
  80: { label: "소나기", icon: "ti-cloud-storm" },
  81: { label: "소나기", icon: "ti-cloud-storm" },
  82: { label: "강한 소나기", icon: "ti-cloud-storm" },
  95: { label: "천둥번개", icon: "ti-bolt" },
  99: { label: "우박", icon: "ti-bolt" },
};

const WIND_DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function windDir(deg) {
  return WIND_DIRS[Math.round(deg / 45) % 8];
}

function windArrow(deg) {
  const arrows = {
    N: "↑",
    NE: "↗",
    E: "→",
    SE: "↘",
    S: "↓",
    SW: "↙",
    W: "←",
    NW: "↖",
  };
  return arrows[windDir(deg)] ?? "→";
}

const GRAPH_TYPES = [
  { key: "temperature", icon: "ti-temperature", label: "온도" },
  { key: "precipitation", icon: "ti-cloud-rain", label: "강수량" },
  { key: "wind", icon: "ti-wind", label: "풍속" },
];

function CalendarPicker({ onSelect, onClose, selectedDate }) {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 92);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 16);

  const [viewYear, setViewYear] = useState(
    selectedDate ? new Date(selectedDate).getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? new Date(selectedDate).getMonth() : today.getMonth(),
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <div
      style={{
        padding: "1.2rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          <i className="ti ti-arrow-left" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={prevMonth}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
            }}
          >
            <i className="ti ti-chevron-left" />
          </button>
          <span
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              minWidth: 80,
              textAlign: "center",
            }}
          >
            {viewYear}년 {months[viewMonth]}
          </span>
          <button
            onClick={nextMonth}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
            }}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </div>
        <div style={{ width: 18 }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          marginBottom: 6,
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#666",
              padding: "2px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          flex: 1,
        }}
      >
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const date = new Date(viewYear, viewMonth, d);
          const disabled = date < minDate || date > maxDate;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today.toISOString().slice(0, 10);
          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(dateStr)}
              disabled={disabled}
              style={{
                background: isSelected ? "#F5C518" : "none",
                border: isToday && !isSelected ? "1px solid #F5C518" : "none",
                borderRadius: 6,
                color: disabled ? "#444" : isSelected ? "#000" : "#fff",
                cursor: disabled ? "not-allowed" : "pointer",
                fontSize: 12,
                padding: "4px 0",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RightCard({ weather, selectedDate, onDateSelect }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [displayCalendar, setDisplayCalendar] = useState(false);

  const switchTo = (toCalendar) => {
    setAnimating(true);
    setTimeout(() => {
      setDisplayCalendar(toCalendar);
      setAnimating(false);
    }, 280);
  };

  const handleCalendarOpen = () => {
    setShowCalendar(true);
    switchTo(true);
  };
  const handleCalendarClose = () => {
    switchTo(false);
    setTimeout(() => setShowCalendar(false), 300);
  };
  const handleDateSelect = (d) => {
    onDateSelect(d);
    handleCalendarClose();
  };

  const now = new Date();
  const dateLabel = selectedDate
    ? new Date(selectedDate).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : now.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      });
  const timeLabel = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const code = weather?.current?.weather_code ?? 0;
  const info = WEATHER_CODES[code] ?? {
    label: "알 수 없음",
    icon: "ti-question-mark",
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        overflow: "hidden",
        height: 200,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: animating ? 0 : 1,
          transition: "opacity 0.28s ease",
          pointerEvents: animating ? "none" : "auto",
        }}
      >
        {displayCalendar ? (
          <CalendarPicker
            onSelect={handleDateSelect}
            onClose={handleCalendarClose}
            selectedDate={selectedDate}
          />
        ) : (
          <div
            style={{
              padding: "1.2rem",
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#F5C518",
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                날씨
              </span>
              <button
                onClick={handleCalendarOpen}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 0,
                }}
                title="날짜 선택"
              >
                <i className="ti ti-calendar" />
              </button>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
                {dateLabel}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: 300,
                  letterSpacing: -0.5,
                  marginBottom: 8,
                }}
              >
                {timeLabel}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i
                  className={`ti ${info.icon}`}
                  style={{ fontSize: 16, color: "#F5C518" }}
                />
                <span style={{ fontSize: 13, color: "#ccc" }}>
                  {info.label}
                </span>
              </div>
            </div>
            {selectedDate &&
              selectedDate !== now.toISOString().slice(0, 10) && (
                <div style={{ fontSize: 11, color: "#F5C518", opacity: 0.7 }}>
                  {new Date(selectedDate).toLocaleDateString("ko-KR")} 데이터
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, type }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const unit =
    type === "temperature" ? "°C" : type === "precipitation" ? "mm" : "m/s";
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        color: "#fff",
      }}
    >
      <div style={{ color: "#888", marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#F5C518", fontWeight: 600 }}>
        {Number(val).toFixed(1)}
        {unit}
      </div>
      {type === "wind" && payload[0]?.payload?.windDir && (
        <div style={{ color: "#aaa" }}>
          {payload[0].payload.windArrow} {payload[0].payload.windDir}
        </div>
      )}
    </div>
  );
}

function WeatherGraph({ data, type }) {
  const [displayed, setDisplayed] = useState(type);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const t = setTimeout(() => {
      setDisplayed(type);
      setOpacity(1);
    }, 320);
    return () => clearTimeout(t);
  }, [type]);

  if (!data?.length)
    return (
      <div
        style={{
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#444",
        }}
      >
        데이터 없음
      </div>
    );

  const unit =
    displayed === "temperature"
      ? "°C"
      : displayed === "precipitation"
        ? "mm"
        : "m/s";

  return (
    <div style={{ transition: "opacity 0.32s ease", opacity }}>
      <ResponsiveContainer width="100%" height={460}>
        {displayed === "precipitation" ? (
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#222"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#555", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit={unit}
            />
            <Tooltip
              content={<CustomTooltip type={displayed} />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="value"
              fill="#F5C518"
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        ) : (
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#222"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#555", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit={unit}
            />
            <Tooltip content={<CustomTooltip type={displayed} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#F5C518"
              strokeWidth={2}
              dot={
                displayed === "wind"
                  ? (props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <text
                          key={`arrow-${cx}-${cy}`}
                          x={cx}
                          y={cy - 8}
                          textAnchor="middle"
                          fill="#F5C518"
                          fontSize={14}
                        >
                          {payload.windArrow}
                        </text>
                      );
                    }
                  : false
              }
              activeDot={{
                r: 4,
                fill: "#F5C518",
                stroke: "#000",
                strokeWidth: 2,
              }}
              animationDuration={600}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function TimeBar({ hours, currentHourIndex, onSelect, selectedHour }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && currentHourIndex >= 0) {
      const el = scrollRef.current;
      const item = el.children[currentHourIndex];
      if (item) {
        el.scrollLeft = item.offsetLeft - 40;
      }
    }
  }, [currentHourIndex]);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: 4,
        overflowX: "auto",
        padding: "12px 16px",
        background: "#0d0d0d",
        borderTop: "1px solid #1e1e1e",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {hours.map((h, i) => {
        const isCurrent = i === currentHourIndex;
        const isSelected = h.time === selectedHour;
        return (
          <button
            key={h.time}
            onClick={() => onSelect(h.time)}
            style={{
              flexShrink: 0,
              background: isSelected ? "#F5C518" : isCurrent ? "#222" : "none",
              border:
                isCurrent && !isSelected
                  ? "1px solid #F5C518"
                  : "1px solid transparent",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              minWidth: 56,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: isSelected ? "#000" : isCurrent ? "#F5C518" : "#555",
                fontWeight: isCurrent || isSelected ? 600 : 400,
              }}
            >
              {h.label}
            </span>
            <span
              style={{
                fontSize: 12,
                color: isSelected ? "#000" : "#aaa",
                fontWeight: 500,
              }}
            >
              {h.temp}°
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GraphToggle({ current, onChange }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      {GRAPH_TYPES.map(({ key, icon, label }) => {
        const active = current === key;
        const isHov = hovered === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: active ? "#F5C518" : "#1a1a1a",
              border: "1px solid",
              borderColor: active ? "#F5C518" : "#2a2a2a",
              borderRadius: 8,
              padding: "10px 12px",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.22s ease",
              width: isHov || active ? 100 : 42,
              whiteSpace: "nowrap",
            }}
          >
            <i
              className={`ti ${icon}`}
              style={{
                fontSize: 18,
                color: active ? "#000" : "#F5C518",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: active ? "#000" : "#ccc",
                opacity: isHov || active ? 1 : 0,
                transition: "opacity 0.18s ease",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`,
    );
    const data = await res.json();
    const addr = data.address;
    return addr.city || addr.county || addr.state || "현재 위치";
  } catch {
    return "현재 위치";
  }
}

async function fetchWeather(lat, lon, date) {
  const today = new Date().toISOString().slice(0, 10);
  const isHistorical = date && date < today;
  const isFuture = date && date > today;

  let url;
  if (isHistorical) {
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${date}&end_date=${date}&hourly=temperature_2m,precipitation,windspeed_10m,winddirection_10m,weathercode,relativehumidity_2m&timezone=Asia%2FSeoul`;
  } else {
    const startDate = isFuture ? date : today;
    const endDate = isFuture
      ? date
      : new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,windspeed_10m,winddirection_10m,weathercode,relativehumidity_2m&current_weather=true&timezone=Asia%2FSeoul&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await fetch(url);
  return res.json();
}

export function WeatherPage() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("위치 확인 중...");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphType, setGraphType] = useState("temperature");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const loadWeather = useCallback(async (lat, lon, date) => {
    setLoading(true);
    try {
      const data = await fetchWeather(lat, lon, date);
      setWeather(data);
    } catch {
      setError("날씨 데이터를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fallback = () => {
      const lat = 37.5665,
        lon = 126.978;
      setLocation({ lat, lon });
      setLocationName("서울특별시");
      loadWeather(lat, lon, null);
    };

    if (!navigator.geolocation) {
      fallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLocation({ lat, lon });
        const name = await reverseGeocode(lat, lon);
        setLocationName(name);
        loadWeather(lat, lon, null);
      },
      (err) => {
        console.warn("위치 오류:", err.code, err.message);
        console.warn("지속적으로 발생시 위치를 서울로 보정합니다.");
        fallback();
      },
      {
        timeout: 8000, // ← 8초 안에 응답 없으면 에러 콜백
        maximumAge: 60000, // ← 1분 이내 캐시된 위치 허용
        enableHighAccuracy: false, // ← false면 더 빠름
      },
    );
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (location) loadWeather(location.lat, location.lon, date);
  };

  const hourly = weather?.hourly;
  const today = new Date().toISOString().slice(0, 10);
  const targetDate = selectedDate ?? today;

  const hours = hourly
    ? hourly.time
        .map((t, i) => ({
          time: t,
          label: t.slice(11, 16),
          temp: Math.round(hourly.temperature_2m[i]),
          precip: hourly.precipitation[i],
          wind: hourly.windspeed_10m[i],
          windDeg: hourly.winddirection_10m[i],
          humidity: hourly.relativehumidity_2m[i],
          code: hourly.weathercode[i],
        }))
        .filter((h) => h.time.startsWith(targetDate))
    : [];

  const nowHour = new Date().getHours();
  const currentHourIndex = hours.findIndex((h) => parseInt(h.label) >= nowHour);

  const activeHour = selectedHour
    ? (hours.find((h) => h.time === selectedHour) ??
      hours[currentHourIndex] ??
      hours[0])
    : (hours[currentHourIndex] ?? hours[0]);

  const graphData = hours.map((h) => ({
    time: h.label,
    value:
      graphType === "temperature"
        ? h.temp
        : graphType === "precipitation"
          ? h.precip
          : h.wind,
    windArrow: windArrow(h.windDeg),
    windDir: windDir(h.windDeg),
  }));

  const currentCode =
    activeHour?.code ?? weather?.current_weather?.weathercode ?? 0;
  const currentInfo = WEATHER_CODES[currentCode] ?? {
    label: "알 수 없음",
    icon: "ti-question-mark",
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "32px 40px 0",
        boxSizing: "border-box",
      }}
    >
      {/* Top cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Left card */}
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "1.4rem",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {loading ? (
            <div style={{ color: "#444", fontSize: 14 }}>불러오는 중...</div>
          ) : error ? (
            <div style={{ color: "#e24b4a", fontSize: 14 }}>{error}</div>
          ) : (
            <>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <i
                    className="ti ti-map-pin"
                    style={{ fontSize: 14, color: "#F5C518" }}
                  />
                  <span style={{ fontSize: 13, color: "#888" }}>
                    {locationName}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 200,
                    letterSpacing: -2,
                    lineHeight: 1,
                    color: "#fff",
                  }}
                >
                  {Math.round(
                    activeHour?.temp ??
                      weather?.current_weather?.temperature ??
                      0,
                  )}
                  °
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i
                  className={`ti ${currentInfo.icon}`}
                  style={{ fontSize: 28, color: "#F5C518" }}
                />
                <span style={{ fontSize: 15, color: "#ccc" }}>
                  {currentInfo.label}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {[
                  {
                    icon: "ti-droplet",
                    label: "강수",
                    value: `${activeHour?.precip?.toFixed(1) ?? 0}mm`,
                  },
                  {
                    icon: "ti-percentage",
                    label: "습도",
                    value: `${activeHour?.humidity ?? "--"}%`,
                  },
                  {
                    icon: "ti-wind",
                    label: "풍속",
                    value: `${activeHour?.wind?.toFixed(1) ?? "--"}m/s`,
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#111",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 4,
                      }}
                    >
                      <i
                        className={`ti ${icon}`}
                        style={{ fontSize: 13, color: "#F5C518" }}
                      />
                      <span style={{ fontSize: 10, color: "#555" }}>
                        {label}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 15, fontWeight: 500, color: "#ddd" }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right card */}
        <RightCard
          weather={weather}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Graph + Toggle */}
      <div style={{ display: "flex", gap: 16, flex: 1, alignItems: "stretch" }}>
        <div
          style={{
            flex: 1,
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "16px 16px 0",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#444",
              marginBottom: 4,
              letterSpacing: 1,
            }}
          >
            {graphType === "temperature"
              ? "기온 (°C)"
              : graphType === "precipitation"
                ? "강수량 (mm)"
                : "풍속 (m/s)"}
          </div>
          {loading ? (
            <div
              style={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#333",
              }}
            >
              불러오는 중...
            </div>
          ) : (
            <WeatherGraph data={graphData} type={graphType} />
          )}
        </div>

        <GraphToggle current={graphType} onChange={setGraphType} />
      </div>

      {/* Time bar */}
      {!loading && hours.length > 0 && (
        <TimeBar
          hours={hours}
          currentHourIndex={currentHourIndex}
          onSelect={setSelectedHour}
          selectedHour={selectedHour}
        />
      )}
    </div>
  );
}
