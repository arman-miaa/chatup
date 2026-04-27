import Image from "next/image";

interface BannerProps {
  imageSrc: string;
  title: string;
  subtitle: string;
}

const Banner = ({ imageSrc, title, subtitle }: BannerProps) => {
  return (
    <div className="relative w-full h-60 sm:h-80 md:h-96 lg:h-112">
      <Image
        src={imageSrc}
        alt="Banner Image"
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>
        <p className="mt-2 text-lg sm:text-xl">{subtitle}</p>
      </div>
    </div>
  );
};

export default Banner;
