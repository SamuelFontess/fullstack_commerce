package com.comercio.projeto_dscommerce.repositories;

import com.comercio.projeto_dscommerce.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
