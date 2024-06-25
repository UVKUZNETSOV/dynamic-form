import express from "express";
import ViteExpress from "vite-express";
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const formDataFromServer = {
  "Имя Фамилия Почта": [
    { type: 'text', name: 'firstName', label: 'First Name', order: 1 },
    { type: 'text', name: 'lastName', label: 'Last Name', order: 2 },
    { type: 'email', name: 'email', label: 'Email', order: 0 },
  ],
  "Частота курения": [
      { type: 'radio-group', name: 'Smoking', label: 'Курение', order: 1, options: [
          { value: 'never-smoked', label: 'Никогда не курил' },
          { value: 'continues-smoke', label: 'Продолжаю курить', subOptions: [
              { value: '5_years_less', label: '5 или менее лет' },
              { value: '6_to_10_years', label: 'от 6 до 10 лет' },
              { value: '10_years_more', label: 'Более 10 лет' },
            ]
          }
        ]
      },
  ],
  "Кто ты, воин?" : [
    { type: 'checkbox', name: 'smth', label: 'Gender', options: [
        { type: 'checkbox', value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    }
  ]
};


app.get("/back", (_, res) => {
  res.send(formDataFromServer);
});

app.post('/back', (req, res) => {
  const formData = req.body;
  console.log('Data:', formData);

  res.json({ message: 'Success', receivedData: formData });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
