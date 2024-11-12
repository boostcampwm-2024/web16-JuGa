import FinanceDataReader as fdr
import json
import os
import mysql.connector
from dotenv import load_dotenv
from pathlib import Path

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

def insert_stocks(stockData) : 
    try : 
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

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
    
    finally :
        if conn.is_connected() :
            cursor.close()
            conn.close()
    
df_krx = fdr.StockListing('KRX')
df_selected = df_krx[['Code','Name','Market']]

insert_stocks(df_selected)