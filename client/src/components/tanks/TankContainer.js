// WaterTank.jsx
import React from "react";
import styles from "../../contexts/styles/TankContainer.module.css";

const TankContainer = ({ waterLevel, type = "water", children }) => {
    const randomColor = () =>{
      const exclude_color=['#000000','#FFFFFF']
      const chars = "0123456789ABCDEF";
      let color;
      do{
        color='#';
        for(let letter=0; letter<6;letter++){
          color+=chars[Math.floor(Math.random()*chars.length)]
        }
      } while(exclude_color.includes(color))
        return color;
    }
    const color = randomColor();
  return (
    <div
      className={styles.waterTank}
    >
      <div
        className={styles.waterFill}
        style={{
          height: `${waterLevel}%`,
          background:
            waterLevel < 20
              ? "linear-gradient(to top, #ff5252, #ff7b7b)"
              : `linear-gradient(to top, ${
                  type === "water" ? "#2196f3" : type === "fertilizer" ?"#10b981":color
                }, ${
                  type === "water" ? "#64b5f6" : type === "fertilizer" ?"#34d399":color
                })`
        }}
      />
      {children}
    </div>
  );
};

export default TankContainer;