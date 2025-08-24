package com.comercio.projeto_dscommerce.dto;

import com.comercio.projeto_dscommerce.entities.Category;
import com.comercio.projeto_dscommerce.entities.Product;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;

public class ProductDTO {

    private Long id;

    @Size(min = 3, max = 80, message = "Nome entre 3 e 80 caracteres")
    @NotBlank(message = "Campo requerido")
    private String name;

    @Size(min = 10, message = "descrição minimo de 10 caracteres")
    @NotBlank(message = "Campo requerido")
    private String description;

    @NotNull(message = "campo requerido")
    @Positive(message = "preço precisa ser positivo")
    private Double price;

    private String imgUrl;

    @NotEmpty(message = "Campo requerido")
    private List<CategoryDTO> categories = new ArrayList<>();


    public ProductDTO() {
    }

    public ProductDTO(Long id, String name, String description, Double price, String imgUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
    }

    public ProductDTO(Product entity) {
        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
        for (Category cat : entity.getCategories()) {
            categories.add(new CategoryDTO(cat));
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }
}
