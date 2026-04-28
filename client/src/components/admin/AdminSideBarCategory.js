import { Children, useEffect, useState } from 'react';
import styles from '../../contexts/styles/AdminSideBarCategory.module.css';

const AdminSideBarCategory = ({children,label,selectedCategory, change}) =>{
    const isSelected = label=== selectedCategory;
    return(
        <div className={styles.categoryContainer}>
            <div className={`${styles.category} ${isSelected?styles.selected:''}`} onClick={()=>change(label)}>
                {Children.map(children, child => child)}
            </div>
        </div>
    )
}
export default AdminSideBarCategory;