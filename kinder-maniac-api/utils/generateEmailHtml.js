const generateEmailHtml = (title, content, buttonText, buttonLink, color) => `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f7fb;
          margin: 0;
          padding: 0;
        }
        .email-container {
          background-color: #ffffff;
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: ${color || '#4CAF50'};
          font-size: 24px;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .content p {
          margin: 15px 0;
        }
        .button-container {
          text-align: center;
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          background-color: ${color || '#4CAF50'};
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #777;
        }
        .footer p {
          margin: 0;
        }
      </style>
    </head>
    <body>

      <div class="email-container">
        <div class="header">
          <h1>${title}</h1>
        </div>

        <div class="content">
          ${content}
          ${buttonLink ? `
            <div class="button-container">
              <a href="${buttonLink}" class="button">${buttonText}</a>
            </div>` : ''}
        </div>

        <div class="footer">
          <p>С уважением, команда kinder-series-maniac.ru</p>
        </div>
      </div>

    </body>
    </html>
  `
module.exports = generateEmailHtml
