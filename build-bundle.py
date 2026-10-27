#!/usr/bin/env python3
"""Reconstrói js/anima-unico.min.89.js a partir dos fontes listados no Gruntfile.js
(substitui o passo concat+uglify do Grunt de 2013). Uso: python3 build-bundle.py"""
import re, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
OUT = 'js/anima-unico.min.89.js'

grunt = open('Gruntfile.js', encoding='utf8').read().split('\n')
files = re.findall(r'"([^"]+\.js)"', '\n'.join(grunt[20:260]))

def resolve(path):
    """O Gruntfile foi escrito no Windows (sem distinção de maiúsculas); resolve o caminho real."""
    if os.path.exists(path):
        return path
    cur = '.'
    for part in path.split('/'):
        match = [e for e in os.listdir(cur) if e.lower() == part.lower()]
        if not match:
            raise FileNotFoundError(path)
        cur = os.path.join(cur, match[0])
    return os.path.normpath(cur).replace(os.sep, '/')

parts = ['/* anima-unico concatenated build (unminified) */\n\n']
for f in files:
    real = resolve(f)
    parts.append('/* ==== ./%s ==== */\n' % real)
    parts.append(open(real, encoding='utf8').read())
    parts.append('\n\n')
data = ''.join(parts)[:-1]  # o bundle original termina com uma única quebra de linha

if '--check' in sys.argv:
    cur = open(OUT, encoding='utf8').read()
    print('idêntico ao bundle atual' if cur == data else 'DIFERENTE do bundle atual')
else:
    open(OUT, 'w', encoding='utf8', newline='').write(data)
    print('gerado %s (%d arquivos, %d bytes)' % (OUT, len(files), len(data.encode('utf8'))))
