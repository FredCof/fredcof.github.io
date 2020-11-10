#coding: UTF-8
import os

pic = "./img/comic/tgcf"
hf = ""

head = [
    "---\n",
    "layout: page\n",
    'description: "This is not your goal!  これはあなたの目標ではありません!"\n',
    "---\n",
    "<!--This page is for home page-->\n",
    '<div class="post-preview">\n'
]

tail = [
    "</div>\n",
    "<hr>\n"
]

for i in os.listdir("./img/comic/tgcf"):
    file = "./comics/tgcf/"+i
    os.makedirs(file)
    file = file + "/index.html" 
    with open(file, 'w+', encoding='utf-8') as f:
        f.writelines(head)
        for j in os.listdir("./img/comic/tgcf/"+i):
            f.write('\t    <img src="{{ post.url | prepend: site.baseurl }}/img/comic/tgcf/'+i+'/'+j+'" alt="">\n')
        f.writelines(tail)