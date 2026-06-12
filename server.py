#!/usr/bin/env python3
"""PURSUE Dashboard Server — serves dashboard.html + /api/check-updates proxy"""
import http.server
import urllib.request
import json
import re
import os

PORT = 8106
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_GET(self):
        if self.path == '/api/check-updates':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            try:
                req = urllib.request.Request(
                    'https://www.war.gov/UFO/',
                    headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html'}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    text = resp.read().decode('utf-8', errors='ignore')
                
                releases = list(set(re.findall(r'[Rr]elease\s*(\d+)', text)))
                release_nums = sorted([int(r) for r in releases])
                latest = max(release_nums) if release_nums else None
                
                # Find dates
                dates = re.findall(r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}', text)
                
                result = {
                    'ok': True,
                    'latestRelease': latest,
                    'allReleases': release_nums,
                    'dates': dates[-5:] if dates else [],
                    'hasUpdate': latest > 2 if latest else None
                }
            except Exception as e:
                result = {'ok': False, 'error': str(e)}
            
            self.wfile.write(json.dumps(result).encode())
            return
        
        return super().do_GET()

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'🛸 PURSUE Dashboard → http://0.0.0.0:{PORT}/dashboard.html')
    server.serve_forever()
