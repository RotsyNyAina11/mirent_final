import { Controller, Post, Body, ValidationPipe, UsePipes, Patch, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CompleteReservationDto } from './dto/complete-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Post('devis')
  @UsePipes(new ValidationPipe())
  createDevis(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createDevis(createReservationDto);
  }

  @Patch(':id/confirm')
  confirmReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.confirmReservation(id);
  }

  @Patch(':id/complete')
  @UsePipes(new ValidationPipe()) 
  completeReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() completeReservationDto: CompleteReservationDto
  ) {
    return this.reservationService.completeReservation(id, completeReservationDto.carburant_retour);
  }

  @Patch(':id/cancel')
  cancelReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.cancelReservation(id);
  }

  @Delete(':id')
  deleteReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.deleteReservation(id);
  }

}
