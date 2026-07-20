interface WeatherProps {
  temp: number;
  humidity: number;
  condition: string;
  icon: string;
}

export default function WeatherCard({ temp, humidity, condition, icon }: WeatherProps) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500 mb-1">آب‌وهوای فعلی</div>
        <div className="text-2xl font-extrabold text-gray-800">{temp}°</div>
        <div className="text-xs text-gray-500 mt-0.5">رطوبت: {humidity}%</div>
      </div>
      <div className="text-center">
        <div className="text-3xl">{icon}</div>
        <div className="text-xs text-gray-600 mt-1">{condition}</div>
      </div>
    </div>
  );
}
