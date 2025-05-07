import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  limit
} from "firebase/firestore";
import { db } from "../libs/firebase";

export interface ReservationData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt: Timestamp;
}

const COLLECTION_NAME = "reservations";

// 予約を作成
export const createReservation = async (data: Omit<ReservationData, 'id' | 'status' | 'createdAt'>) => {
  try {
    const reservation: Omit<ReservationData, 'id'> = {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now()
    };

    console.log("予約データを作成します:", reservation);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), reservation);
    console.log("予約作成成功 - ID:", docRef.id);
    return { id: docRef.id, ...reservation };
  } catch (error) {
    console.error("Error creating reservation: ", error);
    // より詳細なエラー情報をログに出力
    if (error instanceof Error) {
      console.error("エラーの詳細:", error.message);
      console.error("エラースタック:", error.stack);
    }
    throw error;
  }
};

// 特定の日付の予約を取得
export const getReservationsByDate = async (date: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("date", "==", date),
      orderBy("time", "asc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReservationData[];
  } catch (error) {
    console.error("Error getting reservations: ", error);
    throw error;
  }
};

// 全ての予約を取得
export const getAllReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReservationData[];
  } catch (error) {
    console.error("Error getting all reservations: ", error);
    throw error;
  }
};

// 単一の予約を取得
export const getReservation = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ReservationData;
    } else {
      throw new Error("Reservation not found");
    }
  } catch (error) {
    console.error("Error getting reservation: ", error);
    throw error;
  }
};

// 予約のステータスを更新
export const updateReservationStatus = async (id: string, status: ReservationData['status']) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
    return { id, status };
  } catch (error) {
    console.error("Error updating reservation status: ", error);
    throw error;
  }
};

// 予約をキャンセル
export const cancelReservation = async (id: string) => {
  return updateReservationStatus(id, 'canceled');
};

// 予約を削除
export const deleteReservation = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting reservation: ", error);
    throw error;
  }
};

// Firebaseの接続をテストする関数
export const testFirebaseConnection = async () => {
  try {
    console.log("Firebaseへの接続テスト開始");
    // コレクションの参照を取得するだけでは実際の接続は発生しない
    const colRef = collection(db, COLLECTION_NAME);
    
    // 実際にデータを読み取ってみる
    const testQuery = query(colRef, limit(1));
    const snapshot = await getDocs(testQuery);
    
    console.log("Firebaseへの接続成功:", snapshot.size, "件のドキュメントが見つかりました");
    return { success: true, message: `接続成功: ${snapshot.size}件のドキュメントが見つかりました` };
  } catch (error) {
    console.error("Firebaseへの接続テストに失敗:", error);
    if (error instanceof Error) {
      console.error("接続エラーの詳細:", error.message);
      return { success: false, message: error.message };
    }
    return { success: false, message: "不明なエラーが発生しました" };
  }
}; 