---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
date_display: "{{ time.Now.Format "2 January 2006" }}"
# Allowed values (string or list): "Invited Talk", "Organiser", "Contributed Talk", "Poster"
talk_type: "Contributed Talk"
event: ""
event_short: ""
event_url: ""
host: ""
host_short: ""
location: ""
authors: []
summary: ""
links: []
---
