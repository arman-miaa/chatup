import ProductCard from "@/components/shared/ProductCard";

const Home: React.FC = () => {
  const products = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1577212017184-80cc0da11082?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Premium Tournament Jersey",
      price: "79.99",
      link: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pro Tournament Shoes",
      price: "129.99",
      link: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1577212017308-55c4d60d2609?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pro Tournament Shoes",
      price: "129.99",
      link: "#",
    },
    // Add more products here
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default Home;
