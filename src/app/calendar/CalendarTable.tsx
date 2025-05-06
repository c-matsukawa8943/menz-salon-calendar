 "use client";
import React, { useState } from "react";
import styles from "./CalendarTable.module.css";

const TIMES = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getWeekDates(baseDate: Date) {
  // baseDateを含む週の月曜〜日曜の日付配列を返す
  const week: Date[] = [];
  const day = baseDate.getDay();
  // 月曜始まり
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

const CalendarTable: React.FC = () => {
  const [baseDate, setBaseDate] = useState(new Date());
  const [selected, setSelected] = useState<{date: Date, time: string} | null>(null);

  const weekDates = getWeekDates(baseDate);
  const month = weekDates[0].getMonth() + 1;

  const handlePrevWeek = () => {
    const prev = new Date(baseDate);
    prev.setDate(baseDate.getDate() - 7);
    setBaseDate(prev);
    setSelected(null);
  };
  const handleNextWeek = () => {
    const next = new Date(baseDate);
    next.setDate(baseDate.getDate() + 7);
    setBaseDate(next);
    setSelected(null);
  };

  const handleSelect = (date: Date, time: string) => {
    setSelected({ date, time });
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.weekNav}>
        <button className={styles.weekButton} onClick={handlePrevWeek}>前の週</button>
        <div style={{fontWeight: "bold", fontSize: 18}}>{month}月</div>
        <button className={styles.weekButton} onClick={handleNextWeek}>次の週</button>
      </div>
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            {weekDates.map((date, i) => (
              <th key={i} className={i === 0 ? styles.holiday : i === 6 ? styles.today : undefined}>
                {date.getDate()}<br />({WEEKDAYS[date.getDay()]})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map((time) => (
            <tr key={time}>
              {weekDates.map((date, i) => {
                // 仮で全て予約可
                const isSelected = selected && selected.date.toDateString() === date.toDateString() && selected.time === time;
                return (
                  <td
                    key={i}
                    className={styles.selectable + (isSelected ? ' ' + styles.selected : '')}
                    onClick={() => handleSelect(date, time)}
                  >
                    {time}<br />
                    <span className={styles.reserveable}>⚪︎</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={styles.reserveBtn}
        disabled={!selected}
      >
        予約可能○
      </button>
      <div className={styles.selectedDateTime}>
        <div>ご希望の日時</div>
        <div>
          日付: <span>{selected ? `${selected.date.getFullYear()}年${selected.date.getMonth() + 1}月${selected.date.getDate()}日` : ''}</span>
          &nbsp; 時間: <span>{selected ? `${selected.time} ～ 30分` : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarTable;
