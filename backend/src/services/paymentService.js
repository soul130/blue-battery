# Iamport 결제 서비스 상세

const axios = require('axios');

const IAMPORT_API = 'https://api.iamport.kr';

class PaymentService {
  // Iamport 액세스 토큰 획득
  static async getAccessToken() {
    try {
      const response = await axios.post(`${IAMPORT_API}/users/getToken`, {
        imp_key: process.env.IAMPORT_KEY,
        imp_secret: process.env.IAMPORT_SECRET
      });

      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }

      return response.data.response.access_token;
    } catch (error) {
      throw new Error(`Iamport 토큰 획득 실패: ${error.message}`);
    }
  }

  // 결제 정보 조회
  static async getPaymentInfo(impUid, accessToken) {
    try {
      const response = await axios.get(
        `${IAMPORT_API}/payments/${impUid}`,
        {
          headers: {
            Authorization: accessToken
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }

      return response.data.response;
    } catch (error) {
      throw new Error(`결제 정보 조회 실패: ${error.message}`);
    }
  }

  // 결제 취소
  static async cancelPayment(impUid, reason, accessToken) {
    try {
      const response = await axios.post(
        `${IAMPORT_API}/payments/cancel`,
        {
          imp_uid: impUid,
          reason: reason || '사용자 요청'
        },
        {
          headers: {
            Authorization: accessToken
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }

      return response.data.response;
    } catch (error) {
      throw new Error(`결제 취소 실패: ${error.message}`);
    }
  }

  // 부분 취소
  static async partialCancel(impUid, amount, reason, accessToken) {
    try {
      const response = await axios.post(
        `${IAMPORT_API}/payments/cancel`,
        {
          imp_uid: impUid,
          amount: amount,
          reason: reason || '부분 취소'
        },
        {
          headers: {
            Authorization: accessToken
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }

      return response.data.response;
    } catch (error) {
      throw new Error(`부분 취소 실패: ${error.message}`);
    }
  }
}

module.exports = PaymentService;
