from flask import Flask, request, jsonify
import baostock as bs
import pandas as pd
import os
import time
from datetime import datetime

app = Flask(__name__)
save_dir = "./kline_data"
os.makedirs(save_dir, exist_ok=True)


def fetch_k_data(code, start_date, end_date, frequency="d", adjustflag="2"):
    if (not start_date):
        start_date = datetime.today().strftime('%Y-%m-%d')
    rs = bs.query_history_k_data_plus(
        code,
        "date,code,open,high,low,close,volume,amount,adjustflag,pctChg", 
        start_date=start_date,
        end_date=end_date,
        frequency=frequency,
        adjustflag=adjustflag,  # 前复权   
    )
    return rs.get_data()
    # data_list = []
    # while rs.next():
    #     data_list.append(rs.get_row_data())
    # df = pd.DataFrame(data_list, columns=rs.fields)
    # return df


@app.route('/query-history-kline', methods=['GET'])
def query_kline():
    content = request.args
    code = content.get('code')
    start_date = content.get('start_date')
    end_date = content.get('end_date')
    adjustflag = content.get('adjust') or '2'  # 默认前复权
    if not code:
        return jsonify({"error": "Missing stock code"}), 400

    try:
        bs.login()
        df = fetch_k_data(code, start_date=start_date, end_date=end_date,adjustflag=adjustflag)
        print(df)
        result = df.to_dict('records')
        print(result)
        bs.logout()
        return jsonify({"code": 200, "data": result })
    except Exception as e:
        return jsonify({"code": 500, "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
