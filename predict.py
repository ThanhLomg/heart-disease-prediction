import sys
import json
import joblib
import numpy as np

# 1. Tải mô hình và bộ chuẩn hóa đã lưu từ Colab
model = joblib.load('heart_disease_model.pkl')
scaler = joblib.load('scaler.pkl')

def predict():
    try:
        # 2. Nhận dữ liệu JSON từ đối số dòng lệnh (sys.argv[1])
        input_data = json.loads(sys.argv[1])
        
        # Chuyển dữ liệu thành mảng 2D phù hợp với yêu cầu của sklearn
        # Thứ tự các cột phải giống hệt lúc bạn huấn luyện trên Colab
        features = np.array([[
            input_data['age'], input_data['sex'], input_data['cp'], 
            input_data['trestbps'], input_data['chol'], input_data['fbs'], 
            input_data['restecg'], input_data['thalach'], input_data['exang'], 
            input_data['oldpeak'], input_data['slope'], input_data['ca'], 
            input_data['thal']
        ]])

        # 3. Chuẩn hóa dữ liệu đầu vào bằng scaler đã load
        features_scaled = scaler.transform(features)

        # 4. Dự đoán
        prediction = model.predict(features_scaled)

        # 5. In kết quả ra stdout để Node.js nhận được
        # Kết quả 1 là "Có nguy cơ", 0 là "Bình thường"
        print(int(prediction[0]))

    except Exception as e:
        # In lỗi ra stderr nếu có vấn đề
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    predict()