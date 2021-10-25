from bs4 import BeautifulSoup,NavigableString
from selenium import webdriver 
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--no-sandbox',)
options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(options=options,executable_path='./chromedriver.exe')


def get_char_info(char_soup):
    print("get_char_info")
    info=""
    j=0
    is_first_time=False
    spoiler_index=50
    for i in char_soup.find("td",{"style" : "padding-left: 5px;"}):
        if(j>7 and (i=="\n" or i.name=='div') and is_first_time==False):
            spoiler_index=j
            is_first_time=True
        if(j>=7 and j<spoiler_index and i.name != 'br' and i.name != 'div' and i.name != 'i' and i.name != 'b'):
            info+=i
        j+=1
    return info

def get_char_img(char_soup):
    print("get_char_img")
    alt=""
    for i in char_soup.find("h2",class_="normal_header").text:
        if(i=="("):
            break
        alt+=i

    return char_soup.find("img",{"alt" : alt[:-1]})["src"]


def get_char_name(char_url):
    print("get_char_name")
    name=""
    for i in char_url:
        name+=i
        if(i=='/'):
            name=""
    return name.replace('_',' ')




def get_links(driver):
    print("get links")
    div = driver.find_elements_by_tag_name('a')
    char_links=[]
    j=0
    for values in div:  
        if(values is not None and values!=None):
            try:
                if(j<100 and values.get_attribute("href").startswith("https://myanimelist.net/character/")):
                    j+=1
                    if(len(char_links)==0):
                        char_links.append(values.get_attribute("href"))
                    else:
                        if(char_links[len(char_links)-1]!=values.get_attribute("href")):
                            char_links.append(values.get_attribute("href"))
            except:
                pass
            
    return char_links




def get_char_name_info_img(char_links):
    char_names=[]
    char_info=[]
    char_imgs=[]
    print("get_char_name_info_img")
    j=0
    for char_url in char_links:
        driver.get(char_url)
        char_soup=BeautifulSoup(driver.page_source,"lxml")
        print('....................................................................................................')
        print(j)
        char_name=get_char_name(char_url)
        print(char_name)
        char_info.append(get_char_info(char_soup))
        char_names.append(char_name)
        char_imgs.append(get_char_img(char_soup))
        get_char_img(char_soup)
        j+=1
        print('....................................................................................................')
    return char_names,char_info,char_imgs



#add data to lists
print("add data to lists")
char_names_list=[]
char_info_list=[]
char_imgs_list=[]

for i in range(2):
    limit=i*50
    url="https://myanimelist.net/character.php?limit="+str(limit)
    driver.get(url)

    soup=BeautifulSoup(driver.page_source,"lxml")

    char_links=get_links(driver)

    char_names,char_info,char_imgs=get_char_name_info_img(char_links)
    
    char_names_list+=char_names
    char_info_list+=char_info
    char_imgs_list+=char_imgs


#write data on file
import pandas as pd

print("write data on csv")
df = pd.DataFrame(data={"names": char_names_list, "info": char_info_list,"imgs":char_imgs_list})
df.to_csv("../insert_to_database/char_data.csv", sep=',',index=False)

