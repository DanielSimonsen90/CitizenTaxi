﻿// <auto-generated />
using System;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DataAccess.Migrations
{
    [DbContext(typeof(CitizenTaxiDbContext))]
    partial class CitizenTaxiDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Common.Entities.Booking", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Arrival")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("CitizenId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Destination")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Pickup")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CitizenId");

                    b.ToTable("Bookings");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000006"),
                            Arrival = new DateTime(2023, 11, 17, 0, 0, 13, 689, DateTimeKind.Local).AddTicks(6909),
                            CitizenId = new Guid("00000000-0000-0000-0000-000000000002"),
                            Destination = "Frederikshavn Sygehus",
                            Pickup = "Solvej 10, 0000 God by"
                        },
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000007"),
                            Arrival = new DateTime(2023, 11, 17, 1, 30, 13, 691, DateTimeKind.Local).AddTicks(4274),
                            CitizenId = new Guid("00000000-0000-0000-0000-000000000002"),
                            Destination = "Solvej 10, 0000 God by",
                            Pickup = "Frederikshavn Sygehus"
                        });
                });

            modelBuilder.Entity("Common.Entities.Login", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Logins");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000003"),
                            Password = "VtH/hEKvAnRHm/c0lS0IwkDIgl/IzbaPDep4QZSx6hV2br3jnBVhet9RdyBtAvFBoD5AR38haS2IelS/BIbhUg==",
                            Salt = "salt",
                            UserId = new Guid("00000000-0000-0000-0000-000000000001"),
                            Username = "admin"
                        },
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000004"),
                            Password = "ALXb8Wpq657/JDm5lNuxyPXIKCPgET0FZIZfzgNUJbd1LRXJWTLXbIscvif2p4lZXHmIsxe+7QwT9fl6mD6hkw==",
                            Salt = "salt",
                            UserId = new Guid("00000000-0000-0000-0000-000000000002"),
                            Username = "borger"
                        });
                });

            modelBuilder.Entity("Common.Entities.Note", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("CarHeight")
                        .HasColumnType("int");

                    b.Property<Guid>("CitizenId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Companion")
                        .HasColumnType("int");

                    b.Property<int>("Follow")
                        .HasColumnType("int");

                    b.Property<int>("HelpingUtil")
                        .HasColumnType("int");

                    b.Property<bool>("Pensioner")
                        .HasColumnType("bit");

                    b.Property<string>("Residence")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CitizenId")
                        .IsUnique();

                    b.ToTable("Notes");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000005"),
                            CarHeight = 2,
                            CitizenId = new Guid("00000000-0000-0000-0000-000000000002"),
                            Companion = 2,
                            Follow = 3,
                            HelpingUtil = 4,
                            Pensioner = true,
                            Residence = "Solvej 10, 0000 God by"
                        });
                });

            modelBuilder.Entity("Common.Entities.User.Admin", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("LoginId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("LoginId");

                    b.ToTable("Admins");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000001"),
                            Name = "Admin",
                            Role = 1
                        });
                });

            modelBuilder.Entity("Common.Entities.User.Citizen", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("LoginId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("LoginId");

                    b.ToTable("Citizens");

                    b.HasData(
                        new
                        {
                            Id = new Guid("00000000-0000-0000-0000-000000000002"),
                            Email = "",
                            Name = "Borger",
                            Role = 0
                        });
                });

            modelBuilder.Entity("Common.Entities.Booking", b =>
                {
                    b.HasOne("Common.Entities.User.Citizen", "Citizen")
                        .WithMany("Bookings")
                        .HasForeignKey("CitizenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Citizen");
                });

            modelBuilder.Entity("Common.Entities.Note", b =>
                {
                    b.HasOne("Common.Entities.User.Citizen", "Citizen")
                        .WithOne("Note")
                        .HasForeignKey("Common.Entities.Note", "CitizenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Citizen");
                });

            modelBuilder.Entity("Common.Entities.User.Admin", b =>
                {
                    b.HasOne("Common.Entities.Login", "Login")
                        .WithMany()
                        .HasForeignKey("LoginId");

                    b.Navigation("Login");
                });

            modelBuilder.Entity("Common.Entities.User.Citizen", b =>
                {
                    b.HasOne("Common.Entities.Login", "Login")
                        .WithMany()
                        .HasForeignKey("LoginId");

                    b.Navigation("Login");
                });

            modelBuilder.Entity("Common.Entities.User.Citizen", b =>
                {
                    b.Navigation("Bookings");

                    b.Navigation("Note");
                });
#pragma warning restore 612, 618
        }
    }
}
