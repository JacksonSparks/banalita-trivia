from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

def handle_cookie_popup(driver):
    try:
        # Wait for cookie popup to appear
        time.sleep(2)  # Wait for popup animation
        accept_button = driver.find_element('id', 'onetrust-accept-btn-handler')
        accept_button.click()
    except Exception as e:
        print("Error handling cookie popup:", str(e))

def handle_second_popup(driver):
    try:
        # Wait for the second popup to appear
        time.sleep(2)  # Wait for popup animation
        close_button = driver.find_element('id', 'advertClose')
        close_button.click()
    except Exception as e:
        print("Error handling second popup:", str(e))

def scrape_player_data():
    # Set up ChromeDriver
    chrome_driver_path = 'C:\\Users\\spark\\downloads\\chromedriver-win64 (1)\\chromedriver-win64\\chromedriver.exe'
    service = Service(chrome_driver_path)

    # Chrome options to ignore SSL errors
    options = Options()
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--ignore-certificate-errors')

    driver = webdriver.Chrome(service=service, options=options)

    # Load the webpage
    driver.get('https://www.premierleague.com/players')

    # Handle cookie popup (if present)
    handle_cookie_popup(driver)

    # Handle second popup (if present)
    handle_second_popup(driver)

    # Scroll down to load all players
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Wait for content to load
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Get the HTML content after all players are loaded
    content = driver.page_source
    driver.quit()

    soup = BeautifulSoup(content, 'html.parser')

    # Assuming we find the right container for player data
    main = soup.find('main', id='mainContent')
    tbody = main.find('tbody', class_='dataContainer') if main else None

    players = []
    if tbody:
        for row in tbody.find_all('tr'):
            player_td = row.find('td')
            position_td = row.find('td', class_='u-hide-mobile-lg player__position')
            if player_td and position_td:
                player_a = player_td.find('a')
                if player_a:
                    player_name = player_a.text.strip()
                    player_position = position_td.text.strip()

                    # Replace position names with abbreviations
                    player_position = player_position.replace("Midfielder", "MID")
                    player_position = player_position.replace("Forward", "FWD")
                    player_position = player_position.replace("Defender", "DEF")
                    player_position = player_position.replace("Goalkeeper", "GK")

                    players.append(f"{player_name}, {player_position}")

    return players

def write_players_to_file(players, filename='playersEPL.txt'):
    with open(filename, 'w', encoding='utf-8') as file:
        for player in players:
            file.write(player + '\n')

def main():
    players = scrape_player_data()
    if players:
        write_players_to_file(players)

if __name__ == "__main__":
    main()
