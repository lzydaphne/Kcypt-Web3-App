/*
Flex介紹
https://cythilya.github.io/2017/04/04/flexbox-basics/
flex:按照主軸main-axis方向排列

justify-content主軸的對齊方式
align-items交叉軸 (cross axis) 的對齊方式

----tailwind-css----
Center
Use justify-center to justify items along the center of the container’s main axis:
Use items-center to align items along the center of the container’s cross axis

Row
Use flex-row to position flex items horizontally in the same direction as text:
Column
Use flex-col to position flex items vertically:

自定義
https://tailwindcss.com/docs/customizing-spacing#extending-the-default-spacing-scale

p-3 / m-15 ...都是在tailwind.config.js中自定義

*/
import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

/* card component---start */
const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:drop-shadow-xl">
    <div
      className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}
    >
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">{subtitle}</p>
    </div>
  </div>
);
/* card component---end */

const Services = () => {
  return (
    // 第二層
    <div className="flex w-full justify-center items-center gradient-bg-services">
      {/* 左半邊 */}
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        {/* 文字區塊 */}
        <div className="flex-1 flex flex-col justify-start items-start">
          <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
            Services that we
            <br />
            continue to improve
          </h1>
          <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
            The best choice for buying and selling your crypto assets, with the
            various super friendly services we offer
          </p>
        </div>
        {/* 卡片區域 */}
        <div className="flex-1 flex flex-col justify-start items-center">
          <ServiceCard
            color="bg-[#2752E3]"
            title="Security gurantee"
            icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
          <ServiceCard
            color="bg-[#8945F8]"
            title="Best exchange rates"
            icon={<BiSearchAlt fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
          <ServiceCard
            color="bg-[#F84550]"
            title="Fastest transactions"
            icon={<RiHeart2Fill fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
