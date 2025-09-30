import React, { useState, useEffect } from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import { categoryService } from "../services";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    console.log("Navigating to category:", categoryName, "with ID:", categoryId);
    const url = `/books/category/${categoryId}`;
    console.log("Navigation URL:", url);
    history.push(url);
  };

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Categories
      </DropdownToggle>
      <DropdownMenu>
        {loading ? (
          <DropdownItem disabled>
            <Spinner size="sm" className="mr-2" />
            Loading categories...
          </DropdownItem>
        ) : (
          categories.map((category) => (
            <DropdownItem
              key={category.id}
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              {category.name}
            </DropdownItem>
          ))
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default CategoryDropdown;
