"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Reservation.module.css";
import { createReservation } from "../../services/reservationService";

// 提供サービスのリスト（仮データ）
const SERVICES = [
  { id: 1, name: "全身脱毛（1回）", price: 15000 },
  { id: 2, name: "全身脱毛（5回コース）", price: 68000 },
  { id: 3, name: "脇・VIO脱毛（1回）", price: 8000 },
  { id: 4, name: "脇・VIO脱毛（5回コース）", price: 35000 },
  { id: 5, name: "顔脱毛（1回）", price: 6000 },
  { id: 6, name: "顔脱毛（5回コース）", price: 25000 },
  { id: 7, name: "腕脱毛（1回）", price: 5000 },
  { id: 8, name: "脚脱毛（1回）", price: 7000 },
];

interface ReservationFormProps {
  date: string | null;
  time: string | null;
  user: any;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ date, time, user }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // 入力があればエラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "お名前を入力してください";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "有効な電話番号を入力してください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!formData.service) {
      newErrors.service = "サービスを選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !date || !time) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Firebaseに予約データを保存
      const serviceObj = SERVICES.find(s => s.id.toString() === formData.service);
      const serviceName = serviceObj ? serviceObj.name : "";
      
      console.log("送信する予約データ:", { ...formData, date, time });
      
      const reservationData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: serviceName,
        notes: formData.notes,
        date,
        time,
        uid: user.uid,
        userEmail: user.email,
      };
      
      const result = await createReservation(reservationData);
      console.log("予約作成結果:", result);
      
      // 成功メッセージを表示
      setSuccessMessage("予約が完了しました！");
      
      // フォームをリセット
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        notes: "",
      });
      
      // 3秒後に予約確認ページへリダイレクト
      setTimeout(() => {
        router.push(`/reservation/confirmation?id=${result.id}`);
      }, 3000);
    } catch (error) {
      console.error("予約送信エラー:", error);
      
      let errorMessage = "予約の送信に失敗しました。もう一度お試しください。";
      if (error instanceof Error) {
        console.error("エラー詳細:", error.message);
        // Firestore接続エラーの場合はより具体的なメッセージを表示
        if (error.message.includes("Firebase") || error.message.includes("network")) {
          errorMessage = "サーバー接続エラー: インターネット接続を確認してください。";
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 成功メッセージがある場合は表示
  if (successMessage) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>{successMessage}</h2>
        <p>予約確認ページへ移動します...</p>
      </div>
    );
  }

  return (
    <form className={styles.reservationForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>
          お名前 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.formControl} ${errors.name ? styles.errorInput : ""}`}
          placeholder="山田 花子"
        />
        {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.formLabel}>
          電話番号 <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`${styles.formControl} ${errors.phone ? styles.errorInput : ""}`}
          placeholder="090-1234-5678"
        />
        {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>
          メールアドレス <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.formControl} ${errors.email ? styles.errorInput : ""}`}
          placeholder="example@email.com"
        />
        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="service" className={styles.formLabel}>
          ご希望のサービス <span className={styles.required}>*</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={`${styles.formControl} ${errors.service ? styles.errorInput : ""}`}
        >
          <option value="">サービスを選択してください</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} (¥{service.price.toLocaleString()})
            </option>
          ))}
        </select>
        {errors.service && <div className={styles.errorMessage}>{errors.service}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notes" className={styles.formLabel}>
          ご要望・備考
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className={styles.formTextarea}
          placeholder="ご希望があればお知らせください"
          rows={4}
        />
      </div>

      <div className={styles.formActions}>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "予約を確定する"}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm; 