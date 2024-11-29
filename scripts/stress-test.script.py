from locust import HttpUser, task, between, events
import random
from collections import defaultdict
import logging
from typing import Dict, Set
from datetime import datetime

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 글로벌 통계 저장소
class Stats:
    ip_server_mapping: Dict[str, Set[str]] = defaultdict(set)
    request_counts: Dict[str, int] = defaultdict(int)
    
    @classmethod
    def get_summary(cls):
        summary = []
        for ip, servers in cls.ip_server_mapping.items():
            summary.append({
                'ip': ip,
                'servers': list(servers),
                'request_count': cls.request_counts[ip], 
                'is_sticky': len(servers) == 1
            })
        return summary
class IPHashTestUser(HttpUser):
    host = "https://juga.kro.kr"
    wait_time = between(1, 3)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ip = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"

    def on_start(self):
        headers = {
            "X-Forwarded-For": self.ip  ,
            "Content-Type": "application/json"
        }

        with self.client.post(
            "/api/auth/login", 
            json={"email": "jindding", "password": "1234"},
            headers=headers,
            name=f"Login Test ({self.ip})"
        ) as response:
            if response.status_code == 200:
                logger.info(f"Login success for IP {self.ip}")
            else:
                logger.warning(f"Login failed for IP {self.ip}")

    @task(3) 
    def buy_stock(self):
        headers = {
            "X-Forwarded-For": self.ip  ,
            "Content-Type": "application/json"
        }

        with self.client.post(
            "/api/stocks/order/buy",
            headers = headers,
            json = {
                "stock_code": "005930",
                "price": 55400,
                "amount": 1
            },
            catch_response=True,
            name=f"API Test ({self.ip})"
        ) as response:
            if response.status_code == 201:
                logger.info(f"Buy success for IP {self.ip}")
                response.success()
            else:
                logger.warning(f"Buy failed for IP {self.ip}")
                response.failure(f"Status code: {response.status_code}")


    @task(1)
    def sell_stock(self):
        headers = {
            "X-Forwarded-For": self.ip  ,
            "Content-Type": "application/json"
        }

        with self.client.post(
            "/api/stocks/order/sell",
            headers = headers,
            json = {
                "stock_code": "005930",
                "price": 55400,
                "amount": 1
            },
            catch_response=True,
            name=f"API Test ({self.ip})"
        ) as response:
            if response.status_code == 200:
                logger.info(f"Sell success for IP {self.ip}")
                response.success()
            else:
                logger.warning(f"Sell failed for IP {self.ip}")
                response.failure(f"Status code: {response.status_code}")



    @task(1)
    def test_api_endpoint(self):
        headers = {
            "X-Forwarded-For": self.ip  # X-Real-IP 제거
        }
        
        try:
            with self.client.get(
                "/api/ranking",  
                headers=headers,
                catch_response=True,
                name=f"API Test ({self.ip})"
            ) as response:
                # 통계 업데이트
                server_id = response.headers.get('X-Served-By', 'unknown')
                Stats.ip_server_mapping[self.ip].add(server_id)
                Stats.request_counts[self.ip] += 1
                
                # 응답 로깅
                if response.status_code == 200:
                    logger.debug(f"Success - IP: {self.ip}, Server: {server_id}")
                    response.success()
                else:
                    logger.warning(f"Failed - IP: {self.ip}, Status: {response.status_code}")
                    response.failure(f"Status code: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Request failed for IP {self.ip}: {str(e)}")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """테스트 종료 시 상세한 통계 출력"""
    logger.info("\n=== Load Balancing Test Results ===")
    logger.info(f"Test completed at: {datetime.now()}")
    
    summary = Stats.get_summary()
    
    # 통계 출력
    sticky_count = sum(1 for item in summary if item['is_sticky'])
    total_ips = len(summary)
    
    logger.info(f"\nTotal unique IPs tested: {total_ips}")
    logger.info(f"IPs with sticky sessions: {sticky_count}")
    logger.info(f"Sticky session percentage: {(sticky_count/total_ips)*100:.2f}%\n")
    
    # 상세 결과
    logger.info("Detailed Results:")
    for item in summary:
        logger.info(f"IP: {item['ip']}")
        logger.info(f"  - Servers: {', '.join(item['servers'])}")
        logger.info(f"  - Requests: {item['request_count']}")  
        logger.info(f"  - Sticky: {'Yes' if item['is_sticky'] else 'No'}\n")