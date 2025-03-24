import requests



def test():
    url = "http://127.0.0.1:5000/recommend"
    headers = {"Content-Type": "application/json"}
    data = {"customer_id": 101}

    response = requests.post(url, json=data, headers=headers)
    print(response.status_code)
    print(response.text)  # If response is JSON



if __name__ == '__main__':
    test()


