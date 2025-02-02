"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function FurnitureShopPage() {
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedPrice, setSelectedPrice] = useState(null);  // Track price of the selected item
    const [furniture, setFurniture] = useState({
        beds: [],
        tables: []
    });

    useEffect(() => {
        const selectedFurniture = sessionStorage.getItem("selectedFurniture");
        setSelectedItem(selectedFurniture || "No item selected");

        const beds = [
            { name: "Basic Box", price: 100, image: "/furniture/bed_1.jpg" },
            { name: "Hammock", price: 300, image: "/furniture/bed_2.jpg" },
            { name: "Queen Size Bed", price: 600, image: "/furniture/bed_3.jpg" }
        ];

        const tables = [
            { name: "Basic Coffee Table", price: 50, image: "/furniture/table_1.png" },
            { name: "Wooden Dining Table", price: 200, image: "/furniture/table_2.jpg" },
            { name: "Fancy Dining Table", price: 450, image: "/furniture/table_3.png" }
        ];

        setFurniture({
            beds: beds.sort((a, b) => a.price - b.price),
            tables: tables.sort((a, b) => a.price - b.price)
        });
    }, []);

    const handleSelectItem = (category, itemName, price) => {
        setSelectedItem(`${category}: ${itemName}`);
        setSelectedPrice(price); // Set price when an item is selected
        sessionStorage.setItem("selectedFurniture", `${category}: ${itemName}`);
    };

    const handlePurchase = () => {
        alert(`Thank you for purchasing the ${selectedItem}!`);
        // Additional purchase logic can go here (e.g., redirecting to a payment page)
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.furnitureTitle}>Shop</h1>

                {/* Display Beds in a row */}
                <div className={styles.row}>
                    <h2 className={styles.furnitureTitle}>Available Beds:</h2>
                    <div className={styles.rowItems}>
                        {furniture.beds.length > 0 ? (
                            furniture.beds.map((bed) => (
                                <div
                                    key={bed.name}
                                    className={styles.furnitureItem}
                                    onClick={() => handleSelectItem("Bed", bed.name, bed.price)}
                                >
                                    <div>
                                        {bed.name} - ${bed.price}
                                    </div>
                                    <img
                                        src={bed.image}
                                        alt={bed.name}
                                        className={styles.furnitureImage}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No beds available</p>
                        )}
                    </div>
                </div>

                {/* Display Tables in a new row */}
                <div className={styles.row}>
                    <h2 className={styles.furnitureTitle}>Available Tables:</h2>
                    <div className={styles.rowItems}>
                        {furniture.tables.length > 0 ? (
                            furniture.tables.map((table) => (
                                <div
                                    key={table.name}
                                    className={styles.furnitureItem}
                                    onClick={() => handleSelectItem("Table", table.name, table.price)}
                                >
                                    <div>
                                        {table.name} - ${table.price}
                                    </div>
                                    <img
                                        src={table.image}
                                        alt={table.name}
                                        className={styles.furnitureImage}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No tables available</p>
                        )}
                    </div>
                </div>

                {/* Display Selected Item Information */}
                {selectedItem !== "No item selected" && selectedPrice !== null && (
                    <div className={styles.selectedItemInfo}>
                        <h3>Selected Item: {selectedItem}</h3>
                        <p>Price: ${selectedPrice}</p>
                        <button className={styles.purchaseButton} onClick={handlePurchase}>
                            Purchase
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
