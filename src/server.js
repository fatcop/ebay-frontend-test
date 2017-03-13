import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app/components/App';
import template from './template';
import { generateSlug } from './app/helpers';
import fs from 'fs';

const server = express();

const PORT = 8080;

server.use('/assets', express.static('assets'));

server.get('*', (req, res) => {
  
  // Read content file every request so that it can be modified without a server restart.
  // NOTE: Just doing SYNC file read for simplicity and without error handling for now.

  let data = JSON.parse(fs.readFileSync('./assets/content.json', 'utf8'));
  let currentIdx= -1 ;
  let slug = req.url.substr(1); // skip leading "/"

  // Generate slugs for routes & see if request path matches any slug to determine page for content item
  data.content.forEach((it, idx) => {
    it.slug = generateSlug(it.title);
    if (currentIdx === -1 && (!slug || it.slug === slug)) {
      currentIdx = idx;
    }
  });

  if (currentIdx === -1) {
    res.status(404).send('Not Found');
  } else {

    console.log(`Rending: ${data.content[currentIdx].title}`);

    // Render the app components as string to page template
    const appString = renderToString(<App data={data} currentIdx={currentIdx} />);
    res.send(template({
      body: appString
    }));

  }
});

console.log(`Listening on port ${PORT}`);
server.listen(PORT);
