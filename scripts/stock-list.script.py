import FinanceDataReader as fdr
import os
import pymysql
from dotenv import load_dotenv
from pathlib import Path
from sshtunnel import SSHTunnelForwarder

root_dir = Path(__file__).parent
env_path = os.path.join(root_dir, '.env')
# .env 파일 로드
load_dotenv(env_path)

db_config = {
    'host' : os.getenv('DB_HOST'),
    'user' : os.getenv('DB_USERNAME'),
    'password' : os.getenv('DB_PASSWD'),
    'database' : os.getenv('DB_DATABASE'),
}

if __name__ == '__main__':
    
    with SSHTunnelForwarder(
        (os.getenv('SSH_HOST'), 22),
        ssh_username=os.getenv('SSH_USERNAME'),
        ssh_password=os.getenv('SSH_PASSWD'),
        remote_bind_address=(os.getenv('DB_HOST'), 3306)
    ) as tunnel:
        
        with pymysql.connect(
            host='127.0.0.1',
            user=os.getenv('DB_USERNAME'),
            password=os.getenv('DB_PASSWD'),
            db=os.getenv('DB_DATABASE'),
            charset='utf8',
            port=tunnel.local_bind_port,
            cursorclass=pymysql.cursors.DictCursor) as conn:

            with conn.cursor() as cursor:
                try : 
                    df_krx = fdr.StockListing('KRX')
                    df_selected = df_krx[['Code','Name','Market']]
                    stockData = df_selected
                    insert_query = """INSERT INTO stocks (code, name, market) VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE name = VALUES(name), market = VALUES(market)"""
                    
                    records = stockData.to_dict('records')
                    for record in records:
                        values = (record['Code'], record['Name'], record['Market'])
                        cursor.execute(insert_query, values)
                    conn.commit()

                except Exception as e :
                    print(e)
                    conn.rollback()

            