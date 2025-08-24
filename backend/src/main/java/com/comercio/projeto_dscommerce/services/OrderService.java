package com.comercio.projeto_dscommerce.services;

import com.comercio.projeto_dscommerce.dto.OrderDTO;
import com.comercio.projeto_dscommerce.dto.OrderItemDTO;
import com.comercio.projeto_dscommerce.entities.Enum.OrderStatus;
import com.comercio.projeto_dscommerce.entities.Order;
import com.comercio.projeto_dscommerce.entities.OrderItem;
import com.comercio.projeto_dscommerce.entities.Product;
import com.comercio.projeto_dscommerce.entities.User;
import com.comercio.projeto_dscommerce.repositories.OrderItemRepository;
import com.comercio.projeto_dscommerce.repositories.OrderRepository;
import com.comercio.projeto_dscommerce.repositories.ProductRepository;
import com.comercio.projeto_dscommerce.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public OrderDTO findById(Long id) {
        Order order = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Recurso não encontrado"));
        authService.validateSelfOrAdmin(order.getClient().getId());
        return new OrderDTO(order);
    }

    @Transactional
    public OrderDTO insert(OrderDTO dto) {

        Order order = new Order();

        order.setMoment(Instant.now());
        order.setStatus(OrderStatus.WAITING_PAYMENT);

        User user = userService.authenticated();
        order.setClient(user);

        for (OrderItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.getReferenceById(itemDto.getProductId());
            OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), product.getPrice());
            order.getItems().add(item);
        }

        repository.save(order);
        orderItemRepository.saveAll(order.getItems());

        return new OrderDTO(order);
    }

}
