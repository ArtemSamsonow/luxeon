import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Icon } from "@iconify/react";
import { Button, Chip } from "@heroui/react";
import { Link } from "react-router-dom";
import { ImageBannerCream, ImageBannerLacquer, ImageBannerOil, ImageBannerPomade, useBasket } from "@shared";
import { JSX, useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../../../../firebase.ts";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    new?: boolean;
}

interface BasketHook {
    addToBasket: (id: string) => void;
    isInBasket: (id: string) => boolean;
    removeFromBasket: (id: string) => void;
}

export function HomePage(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToBasket, isInBasket, removeFromBasket }: BasketHook = useBasket();

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));

            // Преобразуем данные из Firestore с типизацией
            const items: Product[] = querySnapshot.docs
                .map((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name as string,
                        description: data.description as string,
                        price: data.price as number,
                        image: data.image as string,
                        new: data.new as boolean | undefined,
                    };
                })
                .filter((item) => item.new === true)
                .slice(0, 4);

            setProducts(items);
        };

        fetchData();
    }, []);

    return (
        <main className="flex items-center justify-center">
            <section className="w-full flex flex-col gap-7">
                {/* Слайдер */}
                <div className="relative">
                    <button className="swiper-button-prev-custom absolute left-2 top-1/2 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow">
                        <Icon icon="solar:alt-arrow-left-linear" className="text-black w-10 h-10" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-2 top-1/2 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow">
                        <Icon icon="solar:alt-arrow-right-linear" className="text-black w-10 h-10" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                            prevEl: ".swiper-button-prev-custom",
                            nextEl: ".swiper-button-next-custom",
                        }}
                        autoplay={{
                            delay: 10000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full"
                    >
                        <SwiperSlide>
                            <div className="bg-slider-image-1 bg-no-repeat bg-contain bg-center w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px] transition-all duration-300"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-slider-image-2 bg-no-repeat bg-contain bg-center w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px] transition-all duration-300"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-slider-image-3 bg-no-repeat bg-contain bg-center w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[480px] transition-all duration-300"></div>
                        </SwiperSlide>
                    </Swiper>
                </div>

                {/* Баннеры и Новинки */}
                <div className="flex flex-col gap-10 px-2 md:px-20">
                    <div className="flex gap-3 w-full overflow-x-auto scrollbar-hide rounded-2xl px-2 sm:px-0">
                        <Link to="/oil">
                            <img
                                src={ImageBannerOil}
                                className="w-full max-w-[400px] sm:max-w-[480px] md:max-w-[545px] max-h-[300px] sm:max-h-[500px] md:max-h-[700px] rounded-2xl cursor-pointer shrink-0 object-cover"
                                alt="Баннер масло"
                            />
                        </Link>
                        <Link to="/lacquer">
                            <img
                                src={ImageBannerLacquer}
                                className="w-full max-w-[400px] sm:max-w-[480px] md:max-w-[545px] max-h-[300px] sm:max-h-[500px] md:max-h-[700px] rounded-2xl cursor-pointer shrink-0 object-cover"
                                alt="Баннер лак"
                            />
                        </Link>
                        <Link to="/pomade">
                            <img
                                src={ImageBannerPomade}
                                className="w-full max-w-[400px] sm:max-w-[480px] md:max-w-[545px] max-h-[300px] sm:max-h-[500px] md:max-h-[700px] rounded-2xl cursor-pointer shrink-0 object-cover"
                                alt="Баннер помада"
                            />
                        </Link>
                        <Link to="/cream">
                            <img
                                src={ImageBannerCream}
                                className="w-full max-w-[400px] sm:max-w-[480px] md:max-w-[545px] max-h-[300px] sm:max-h-[500px] md:max-h-[700px] rounded-2xl cursor-pointer shrink-0 object-cover"
                                alt="Баннер крем"
                            />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-bold">Новинки</h2>
                            <Link to="/new" className="hover:opacity-80 transition">
                                <span className="text-md font-bold">Посмотреть все</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {products.map((product) => {
                                const inBasket: boolean = isInBasket(product.id);

                                return (
                                    <div key={product.id} className="border relative flex flex-col p-4 rounded mx-auto max-w-[342px]">
                                        {product.new && (
                                            <Chip color="success" className="absolute top-1 left-1">
                                                New
                                            </Chip>
                                        )}
                                        <img src={product.image} alt={product.name} className="w-fit mx-auto h-64 bg-contain mb-2" />
                                        <h2 className="font-bold mb-2">{product.name}</h2>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                                        <Button
                                            color={inBasket ? "danger" : "primary"}
                                            className="mt-auto"
                                            onClick={() => (inBasket ? removeFromBasket(product.id) : addToBasket(product.id))}
                                        >
                                            {inBasket ? "Удалить из корзины" : `${product.price} ₽`}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
