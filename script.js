/* General Page Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(to right, #f0f4f8, #d9e2ec);
  color: #333;
  line-height: 1.6;
  padding: 2rem;
}

header {
  text-align: center;
  padding: 2rem 0;
  background-color: #0077b6;
  color: white;
  border-radius: 10px;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-in-out;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.features {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.features h2 {
  display: flex;
  justify-content: center;
  color: #003366;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.feature {
  max-width: 600px;
  border: 2px solid #0077b6;
  border-radius: 10px;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #ffffff;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  margin-bottom: 0.5rem;
  color: #0077b6;
}

.feature i.clock-icon::before {
  content: "\f017"; /* Font Awesome clock icon */
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  margin-right: 8px;
}

.cta {
  max-width: 600px;
  margin: 0 auto 3rem auto;
  padding: 1.5rem;
  background-color: #e0f4ff;
  border-radius: 10px;
  text-align: center;
  animation: fadeInUp 1s ease-in-out;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cta h2 {
  margin-bottom: 1rem;
  color: #005f87;
  font-size: 1.75rem;
  text-align: center;
}

.cta button {
  background: #0077b6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.cta button:hover {
  background: #005f87;
  transform: scale(1.05);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-in-out;
}

label {
  font-weight: bold;
}

input[type="number"] {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

input[type="number"]:focus {
  border-color: #0077b6;
  outline: none;
}

input:valid {
  border-color: #28a745;
}

input:invalid {
  border-color: #dc3545;
}

button[type="submit"],
button[type="button"] {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover,
button[type="button"]:hover {
  background: #218838;
  transform: scale(1.03);
}

.results {
  background: #e9f7ef;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  animation: fadeIn 1s ease-in-out;
}

footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

#calculatorSection,
#additionalFields {
  display: none;
  animation: fadeInUp 0.8s ease-in-out;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .features, .cta, .container {
    padding: 1rem;
  }

  .cta h2 {
    font-size: 1.4rem;
  }

  button {
    width: 100%;
  }
}
