import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CardProps {
  card: {
    imageSrc: string;
    title: string;
    date: string;
    location: string;
    price: number;
    category: string;
  };
}

const TournamentsCard = ({ card }: CardProps) => {
  const { imageSrc, title, date, location, price, category } = card;

  return (
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-white">
      <div className="relative">
        <Image
          src={imageSrc}
          alt="Event image"
          layout="responsive"
          width={500}
          height={300}
          objectFit="cover"
        />
        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-bold">Date:</span> {date}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-bold">Location:</span> {location}
        </p>
        <p className="text-lg font-bold text-gray-800 mt-2">
          <span className="text-sm text-gray-600">Price: </span>${price}
        </p>
        <div className="mt-4 text-center">
          <Button className="w-full">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentsCard;
