"use client";
import React, { useState, useEffect } from "react";
import styles from "./CalendarTable.module.css";
import { useRouter } from "next/navigation";
import { getReservationsByDate } from "../../services/reservationService";

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
  const router = useRouter();
  const [baseDate, setBaseDate] = useState(new Date());
  const [selected, setSelected] = useState<{date: Date, time: string} | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const weekDates = getWeekDates(baseDate);
  const month = weekDates[0].getMonth() + 1;

  // 予約済みの時間枠を取得
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        const slots: Record<string, string[]> = {};
        const weekDates = getWeekDates(baseDate);
        for (const date of weekDates) {
          const dateStr = date.toISOString().split('T')[0];
          const reservations = await getReservationsByDate(dateStr);
          const bookedTimes = reservations
            .filter(r => r.status !== 'canceled')
            .map(r => r.time);
          slots[dateStr] = bookedTimes;
        }
        setBookedSlots(slots);
      } catch (error) {
        console.error("予約データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();
  }, [baseDate]);

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
    // 予約済みの時間は選択できないようにする
    const dateStr = date.toISOString().split('T')[0];
    if (bookedSlots[dateStr]?.includes(time)) {
      return;
    }
    
    setSelected({ date, time });
  };

  const handleReservation = () => {
    if (selected) {
      // 選択した日時をクエリパラメータとして渡す
      const date = selected.date.toISOString().split('T')[0];
      const time = selected.time;
      router.push(`/reservation?date=${date}&time=${time}`);
    }
  };

  // 時間枠の予約状況を確認
  const getSlotStatus = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    if (bookedSlots[dateStr]?.includes(time)) {
      return 'booked'; // 予約済み
    }
    return 'available'; // 予約可能
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.weekNav}>
        <button className={styles.weekButton} onClick={handlePrevWeek}>前の週</button>
        <div style={{fontWeight: "bold", fontSize: 18}}>{month}月</div>
        <button className={styles.weekButton} onClick={handleNextWeek}>次の週</button>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>カレンダー情報を読み込んでいます...</p>
        </div>
      ) : (
        <>
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
                    const status = getSlotStatus(date, time);
                    const isSelected = selected && selected.date.toDateString() === date.toDateString() && selected.time === time;
                    const isBooked = status === 'booked';
                    
                    return (
                      <td
                        key={i}
                        className={`
                          ${isBooked ? styles.booked : styles.selectable}
                          ${isSelected ? styles.selected : ''}
                        `}
                        onClick={() => !isBooked && handleSelect(date, time)}
                      >
                        {time}<br />
                        <span className={isBooked ? styles.bookedIcon : styles.reserveable}>
                          {isBooked ? '✕' : '⚪︎'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.reserveable}>⚪︎</span> 予約可能
            </div>
            <div className={styles.legendItem}>
              <span className={styles.bookedIcon}>✕</span> 予約済み
            </div>
          </div>
          
          <button
            className={styles.reserveBtn}
            disabled={!selected}
            onClick={handleReservation}
          >
            予約に進む
          </button>
          
          <div className={styles.selectedDateTime}>
            <div>ご希望の日時</div>
            <div>
              日付: <span>{selected ? `${selected.date.getFullYear()}年${selected.date.getMonth() + 1}月${selected.date.getDate()}日` : ''}</span>
              &nbsp; 時間: <span>{selected ? `${selected.time} ～ 30分` : ''}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarTable;
