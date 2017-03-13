export default ({ body }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>eBay FrontEnd Test</title>
        <link rel="stylesheet" href="/assets/app.css" />
      </head>
      
      <body>
        <div id="app">${body}</div>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
  `;
};
