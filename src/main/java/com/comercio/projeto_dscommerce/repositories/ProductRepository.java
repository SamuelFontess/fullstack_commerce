package com.comercio.projeto_dscommerce.repositories;

import com.comercio.projeto_dscommerce.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
