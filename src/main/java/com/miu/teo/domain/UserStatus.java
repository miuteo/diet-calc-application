package com.miu.teo.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserStatus.
 */
@Entity
@Table(name = "user_status")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "protein_need")
    private Integer proteinNeed;

    @Column(name = "cal_protein_need")
    private Integer calProteinNeed;

    @Column(name = "fat_need")
    private Integer fatNeed;

    @Column(name = "cal_fat_need")
    private Integer calFatNeed;

    @Column(name = "carbohydrate_need")
    private Integer carbohydrateNeed;

    @Column(name = "cal_carbohydrate_need")
    private Integer calCarbohydrateNeed;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserStatus id(Long id) {
        this.id = id;
        return this;
    }

    public Double getWeight() {
        return this.weight;
    }

    public UserStatus weight(Double weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getProteinNeed() {
        return this.proteinNeed;
    }

    public UserStatus proteinNeed(Integer proteinNeed) {
        this.proteinNeed = proteinNeed;
        return this;
    }

    public void setProteinNeed(Integer proteinNeed) {
        this.proteinNeed = proteinNeed;
    }

    public Integer getCalProteinNeed() {
        return this.calProteinNeed;
    }

    public UserStatus calProteinNeed(Integer calProteinNeed) {
        this.calProteinNeed = calProteinNeed;
        return this;
    }

    public void setCalProteinNeed(Integer calProteinNeed) {
        this.calProteinNeed = calProteinNeed;
    }

    public Integer getFatNeed() {
        return this.fatNeed;
    }

    public UserStatus fatNeed(Integer fatNeed) {
        this.fatNeed = fatNeed;
        return this;
    }

    public void setFatNeed(Integer fatNeed) {
        this.fatNeed = fatNeed;
    }

    public Integer getCalFatNeed() {
        return this.calFatNeed;
    }

    public UserStatus calFatNeed(Integer calFatNeed) {
        this.calFatNeed = calFatNeed;
        return this;
    }

    public void setCalFatNeed(Integer calFatNeed) {
        this.calFatNeed = calFatNeed;
    }

    public Integer getCarbohydrateNeed() {
        return this.carbohydrateNeed;
    }

    public UserStatus carbohydrateNeed(Integer carbohydrateNeed) {
        this.carbohydrateNeed = carbohydrateNeed;
        return this;
    }

    public void setCarbohydrateNeed(Integer carbohydrateNeed) {
        this.carbohydrateNeed = carbohydrateNeed;
    }

    public Integer getCalCarbohydrateNeed() {
        return this.calCarbohydrateNeed;
    }

    public UserStatus calCarbohydrateNeed(Integer calCarbohydrateNeed) {
        this.calCarbohydrateNeed = calCarbohydrateNeed;
        return this;
    }

    public void setCalCarbohydrateNeed(Integer calCarbohydrateNeed) {
        this.calCarbohydrateNeed = calCarbohydrateNeed;
    }

    public User getUser() {
        return this.user;
    }

    public UserStatus user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserStatus)) {
            return false;
        }
        return id != null && id.equals(((UserStatus) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserStatus{" +
            "id=" + getId() +
            ", weight=" + getWeight() +
            ", proteinNeed=" + getProteinNeed() +
            ", calProteinNeed=" + getCalProteinNeed() +
            ", fatNeed=" + getFatNeed() +
            ", calFatNeed=" + getCalFatNeed() +
            ", carbohydrateNeed=" + getCarbohydrateNeed() +
            ", calCarbohydrateNeed=" + getCalCarbohydrateNeed() +
            "}";
    }
}
