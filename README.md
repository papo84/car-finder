# 🚗 Car Finder

A modern, AI-powered car recommendation wizard built with Node.js, TypeScript, and Express. This application helps users find their perfect car through an interactive questionnaire that uses OpenAI's GPT-4 to provide personalized recommendations.

## ✨ Features

- **Interactive Wizard Interface**: Step-by-step questionnaire with progress tracking
- **AI-Powered Recommendations**: Uses OpenAI GPT-4 for intelligent car suggestions
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Multiple Question Types**: Support for multiple choice, text, and number inputs
- **Comprehensive Results**: Detailed car recommendations with pros, cons, and features
- **Share Functionality**: Easy sharing of results
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: OpenAI GPT-4 API
- **Styling**: Custom CSS with modern design patterns
- **Development**: ts-node-dev for hot reloading

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carFinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📱 How to Use

1. **Start the Wizard**: Open the application in your browser
2. **Answer Questions**: Go through the interactive questionnaire about your car preferences
3. **Get Recommendations**: Receive AI-powered car recommendations based on your answers
4. **Review Results**: See detailed information about recommended cars including:
   - Specific car model and year
   - Estimated price range
   - Detailed reasoning
   - Key features
   - Pros and cons
5. **Share or Restart**: Share your results or start over with new preferences

## 🎯 Question Categories

The wizard covers essential car-buying factors:

- **Budget**: Price range preferences
- **Usage**: Primary use case (commuting, family, adventure, etc.)
- **Passenger Capacity**: Number of people to accommodate
- **Fuel Preference**: Gasoline, hybrid, electric, etc.
- **Driving Style**: Conservative, balanced, sporty, or luxury-focused
- **Climate**: Weather considerations
- **Parking**: Parking situation and space constraints
- **Maintenance**: Importance of low maintenance costs
- **Features**: Priority features (safety, technology, performance, etc.)
- **Brand Preferences**: Optional brand considerations

## 🔧 API Endpoints

- `GET /api/car-finder/questions` - Get all wizard questions
- `POST /api/car-finder/recommendation` - Get car recommendation based on answers

## 🎨 Customization

### Adding New Questions

Edit `src/data/questions.ts` to add or modify questions:

```typescript
{
  id: 'new_question',
  text: 'Your question text here?',
  type: 'multiple-choice', // or 'text', 'number'
  options: ['Option 1', 'Option 2'], // for multiple-choice
  required: true
}
```

### Modifying the AI Prompt

Edit the prompt in `src/services/openaiService.ts` to change how the AI generates recommendations.

### Styling

Modify `public/styles.css` to customize the appearance of the application.

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure your API key is correctly set in the `.env` file
   - Verify the key has sufficient credits

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Or kill the process using the current port

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`

### Debug Mode

Run with additional logging:
```bash
DEBUG=* npm run dev
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy Car Hunting! 🚗✨** 