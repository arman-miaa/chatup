import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    imageSrc: string;
    title: string;
    price: string;
    link: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { imageSrc, title, price, link } = product;

  return (
    <Card className="max-w-sm rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-white">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={title}
          layout="responsive"
          width={300}
          height={300}
          objectFit="cover"
          className="rounded-t-lg w-24 h-24 "
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-lg font-bold text-gray-800 mt-2">${price}</p>
        <div className="mt-4 text-center ">
          <Link href={link} className="text-blue-500  hover:underline">
            <Button className="w-full">View Product</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
