from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import generics,status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.views import View
from django.conf import settings

class Product_List(APIView):
    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')
        category = self.request.query_params.get('category')

        if product_id is not None:
            product = Product_M.objects.get(pk=product_id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)

        if category is not None:
            product = Product_M.objects.filter(Category__Categories_Name=category)
            serializer = ProductSerializer(product,many=True)
            return Response(serializer.data)
        
        products = Product_M.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = ProductPostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'product added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        pro_size = kwargs.get('pk')
        instance = get_object_or_404(Product_M, P_Size_ID=pro_size)
        serializer = ProductPostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        pro_size = kwargs.get('pk')
        instance = get_object_or_404(Product_M, P_Size_ID=pro_size)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
    

from django.db.models import Q

class ProductSearchView(APIView):
  def get(self, request, *args, **kwargs):
    query = request.query_params.get('query', '')
    print(f"Query: {query}") # Debugging line

    product_results = Product_M.objects.filter(
        Q(P_Name__icontains=query) | 
        Q(P_Desc__icontains=query)
    )
    print(f"Product Results: {product_results}") # Debugging line

    product_serializer = ProductSerializer(product_results, many=True).data
    return Response({
        'products': product_serializer,
    })

class CategoriesList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    
class Product_Color_MList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Product_Color_M.objects.all()
    serializer_class = Product_Color_MSerializer
    
class Product_Size_MList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Product_Size_M.objects.all()
    serializer_class = Product_Size_MSerializer
    
class Product_SizeList(APIView):
    def get(self, request, *args, **kwargs):
        product = self.request.query_params.get('product')
        pro_size=kwargs.get('pk')
        queryset = Product_Size.objects.all()

        if pro_size:
            queryset = Product_Size.objects.filter(P_Size_ID=pro_size)
            serializer = Product_SizeSerializer(queryset, many=True)
            return Response(serializer.data)
        
        if product:
            queryset = queryset.filter(Product_ID=product)

        serializer = Product_SizeSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = Product_SizePostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'product size and stocks added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        pro_size = kwargs.get('pk')
        instance = get_object_or_404(Product_Size, P_Size_ID=pro_size)
        serializer = Product_SizePostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        pro_size = kwargs.get('pk')
        instance = get_object_or_404(Product_Size, P_Size_ID=pro_size)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
    
class Product_ImgList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Product_Img.objects.all()
    serializer_class = Product_ImgSerializer
    
class Status_MList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Status_M.objects.all()
    serializer_class = Status_MSerializer
    
class Offer_MList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Offer_M.objects.all()
    serializer_class = Offer_MSerializer
    
class Payment_ModeList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Payment_Mode.objects.all()
    serializer_class = Payment_ModeSerializer

import jwt
   
class Product_RateReview_MList(APIView):
    def get(self, request, *args, **kwargs):
        p_id = request.query_params.get('p_id')  # Get the p_id from query parameters
        queryset = Product_RateReview_M.objects.all()

        if p_id:
            queryset = queryset.filter(P_ID=p_id)  # Filter the queryset based on p_id

        serializer = Product_RateReview_MSerializer(queryset, many=True)
        return Response(serializer.data)

     
    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id is not None:
                request.data['User_ID'] = user_id  # Assign user_id from JWT to User_ID field
                serializer = Product_RateReview_MPostSerializer(data=request.data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)    
   

class CartDetailView(APIView):
    def get_cart_for_user(self, user):
        cart, created = Cart_M.objects.get_or_create(User_ID=user)
        return cart
    
   
    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            current_user = User.objects.get(pk=user_id)  # Assuming your user model is named User

            cart = self.get_cart_for_user(current_user)
            serialized_cart = Cart_MSerializer(cart).data
            cart_items = Cart_Details.objects.filter(Cart_ID=cart)
            cart_items_serializer = Cart_DetailsSerializer(cart_items, many=True).data

            item_ids = cart_items.values_list('P_ID', flat=True)
            menu_items = Product_M.objects.filter(P_ID__in=item_ids)
            menu_serializer = ProductSerializer(menu_items, many=True).data

            response_data = {
                    'cart': serialized_cart,
                    'cart_items': cart_items_serializer,
                    'menus': menu_serializer,
                    'message': 'Cart retrieved successfully'
                }

            return Response(response_data)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

  
    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            current_user = User.objects.get(pk=user_id)  # Assuming your user model is named User

            # Retrieve or create a cart based on the user making the request
            cart_obj, created = Cart_M.objects.get_or_create(User_ID=current_user)
            cart_id = cart_obj.CartID
            data = request.data.copy()
            data['Cart_ID'] = cart_id

            # Validate serializer data
            serializer = Cart_DetailsSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # Add the selected item to the cart details
            item = serializer.validated_data['P_ID']
            quantity = serializer.validated_data['ItemQuantity']
            size_id = serializer.validated_data.get('Size_ID', None)
            subtotal = item.P_Price * quantity
            cmst = item.P_Price * quantity
            cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj, P_ID=item)

            if cart_details.exists():
                cart_detail = cart_details.first()
                cart_detail.ItemQuantity += quantity
                cart_detail.Subtotal = cart_detail.ItemQuantity * cart_detail.P_ID.P_Price
                cart_detail.save()
            else:
                # If the cart detail does not exist, create a new one
                Cart_Details.objects.create(Cart_ID=cart_obj, P_ID=item, ItemQuantity=quantity, Subtotal=subtotal, Size_ID=size_id)
                # Cart_Details.objects.create(Cart_ID=cart_obj, P_ID=item, ItemQuantity=quantity, Subtotal=subtotal)

            # Update the total in the Cart_M model
            cart_obj.Total += subtotal
            cart_obj.Subtotal += cmst
            cart_obj.save()
            response_data = {
                'message': 'Item added to the cart successfully',
                'cart': Cart_MSerializer(cart_obj).data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            current_user = User.objects.get(pk=user_id)  # Assuming your user model is named User

            # Retrieve or create a cart based on the user making the request
            cart_obj, created = Cart_M.objects.get_or_create(User_ID=current_user)
            cart_id = cart_obj.CartID

            # Validate serializer data
            serializer = Cart_DetailsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Find or create the cart detail for the item
            item = serializer.validated_data['P_ID']

            # Try to find an existing cart detail for the item
            cart_detail, created = Cart_Details.objects.get_or_create(Cart_ID=cart_obj, P_ID=item)

            # If the cart detail already exists, update the quantity and subtotal
            cart_detail.ItemQuantity += 1
            cart_detail.Subtotal = item.P_Price * cart_detail.ItemQuantity
            cart_detail.save()

            # Recalculate the subtotal for the entire cart
            cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
            cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
            
            # Update the total for the entire cart
            cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts
            cart_obj.save()

            response_data = {
                'message': 'Item updated in the cart successfully',
                'cart': Cart_MSerializer(cart_obj).data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
   
    def patch(self, request, *args, **kwargs):

        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            current_user = User.objects.get(pk=user_id)  # Assuming your user model is named User

            # Retrieve or create a cart based on the user making the request
            cart_obj, created = Cart_M.objects.get_or_create(User_ID=current_user)
            cart_id = cart_obj.CartID

            serializer = Cart_DetailsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Find or create the cart detail for the item
            item = serializer.validated_data['P_ID']
            quantity = serializer.validated_data['ItemQuantity']
            subtotal = item.P_Price * quantity

            # Try to find an existing cart detail for the item
            try:
                cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, P_ID=item)

                # If the cart detail already exists, update the quantity and subtotal
                if cart_detail.ItemQuantity > 1:
                    # Decrease the item quantity by 1
                    cart_detail.ItemQuantity -= 1
                    # Update the subtotal based on the new quantity
                    cart_detail.Subtotal = item.P_Price * cart_detail.ItemQuantity 
                    cart_detail.save()
                else:
                    cart_detail.delete()

                # Recalculate total and subtotal for the cart
                cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
                cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
                cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts

                cart_obj.save()

            except Cart_Details.DoesNotExist:
                pass

            # Update the total in the Cart_M model

            response_data = {
                'message': 'Item updated in the cart successfully',
                'cart': Cart_MSerializer(cart_obj).data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        

from django.http import Http404


class CartDetailsDeleteView(APIView):
    def delete(self, request, cart_item_id, *args, **kwargs):
        try:
            # Attempt to retrieve the Cart_Details object
            cart_item = Cart_Details.objects.get(pk=cart_item_id)
        except Cart_Details.DoesNotExist:
            # If the object doesn't exist, return a 404 response
            raise Http404("Cart item does not exist")

        # Retrieve the parent cart of the cart item
        cart = cart_item.Cart_ID

        # Update total and subtotal in the cart
        cart.Total -= cart_item.Subtotal
        cart.Subtotal -= cart_item.Subtotal

        # Save the updated cart
        cart.save()

        # Delete the cart item
        cart_item.delete()

        return Response({'message': 'Cart item deleted successfully'})
    




class OrderCreateView(APIView):
    serializer_class = Order_MSerializer
    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            current_user = User.objects.get(pk=user_id)  # Assuming your user model is named User

            # Extract Status_ID from request data if provided, otherwise use default
            status_id = request.data.get('Status_ID')
            address_ID = request.data.get('Address_ID')
            
            # Convert status_id to integer
            status_id = int(status_id) if status_id else 2

            new_order_data = {
                'OrderDate': timezone.now(),
                'User_ID': current_user.id,
                'Status_ID': status_id,
                'Address_ID':address_ID,
            }

            serializer = Order_MSerializer(data=new_order_data)
            serializer.is_valid(raise_exception=True)

            new_order = serializer.save()

            cart_items = Cart_Details.objects.filter(Cart_ID__User_ID=current_user)
            cart = Cart_M.objects.filter(User_ID=current_user)

            total = 0
            for cart_item in cart_items:
                subtotal = cart_item.Subtotal
                Order_Details.objects.create(
                    ItemQuantity=cart_item.ItemQuantity,
                    Subtotal=subtotal,
                    P_ID=cart_item.P_ID,
                    Order_ID=new_order,
                    size=cart_item.Size_ID,
                )
                total += subtotal

                # Fetch the product size details
                product_size = Product_Size.objects.get(Product_ID=cart_item.P_ID, size=cart_item.Size_ID)
                # Reduce the stock by the quantity bought
                product_size.Stock -= cart_item.ItemQuantity
                product_size.save() # Save the updated product size details

            new_order.Total = total
            new_order.save()
            cart_items.delete()
            cart.delete()
            return Response({'message': 'Order created successfully'}, status=status.HTTP_201_CREATED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        


    def get(self, request, order_id=None, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token,settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id:
                if order_id:
                    # Retrieve a specific order for the current user
                    order = get_object_or_404(Order_M, OrderID=order_id, User_ID=user_id)
                    serializer = Order_MGetSerializer(order)
                    return Response(serializer.data)
                else:
                    # Retrieve a list of all orders for the current user
                    orders = Order_M.objects.filter(User_ID=user_id)
                    serializer = Order_MGetSerializer(orders, many=True)
                    return Response(serializer.data)
            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

  
# class ComplaintView(APIView):
#     def get(self, request, *args, **kwargs):
#         auth_header = request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         try:
#             decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             user_id = decoded_token.get("user_id", None)

#             current_user = User.objects.get(pk=user_id)

#             complaints = Complaint_EC.objects.filter(User_ID=current_user)
#             serializer = Complaint_ECSerializer(complaints, many=True)

#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except jwt.ExpiredSignatureError:
#             return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.InvalidTokenError:
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

#     def post(self, request, *args, **kwargs):
#         auth_header = request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         try:
#             decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             user_id = decoded_token.get("user_id", None)

#             current_user = User.objects.get(pk=user_id)

#             serializer = Complaint_ECSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)

#             complaint = serializer.save(User_ID=current_user)

#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except jwt.ExpiredSignatureError:
#             return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.InvalidTokenError:
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)


class ComplaintView(APIView):
    def get_user_id_from_token(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)
            return user_id
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError("Token has expired")
        except jwt.InvalidTokenError:
            raise jwt.InvalidTokenError("Invalid token")

    def get(self, request, *args, **kwargs):
        try:
            user_id = self.get_user_id_from_token(request)
            current_user = User.objects.get(pk=user_id)
            complaints = Complaint_EC.objects.filter(User_ID=current_user)
            serializer = Complaint_ECSerializer(complaints, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, *args, **kwargs):
        try:
            user_id = self.get_user_id_from_token(request)
            current_user = User.objects.get(pk=user_id)
            serializer = Complaint_ECSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            complaint = serializer.save(User_ID=current_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@method_decorator(csrf_exempt, name='dispatch')
class CancelOrderView(View):
    def post(self, request, *args, **kwargs):
        order_id = kwargs.get('order_id')
        order = get_object_or_404(Order_M, OrderID=order_id)
        
        # Check if the order is within the 24-hour cancellation window
        cancellation_deadline = order.OrderDate + timezone.timedelta(hours=24)
        if timezone.now() > cancellation_deadline:
            messages.error(request, 'Order cancellation is not allowed after 24 hours.')
            return JsonResponse({'message': 'Order cancellation is not allowed after 24 hours.'}, status=400)
        
        # Check if the order status is "Processing"
        processing_status = Status_M.objects.get(Status_Name='Processing')
        if order.Status_ID != processing_status:
            messages.error(request, 'Order cancellation is only allowed for orders in processing status.')
            return JsonResponse({'message': 'Order cancellation is only allowed for orders in processing status.'}, status=400)
        
        # If all checks pass, proceed with cancellation
        canceled_status = Status_M.objects.get(Status_Name='cancelled')
        order.Status_ID = canceled_status
        order.save()
        messages.success(request, 'Order has been canceled.')
        return JsonResponse({'message': 'Order has been canceled.'})

# class Wishlist_MList(APIView):
#     def get(self, request, *args, **kwargs):
#         user_id = request.query_params.get('user_id')  
#         queryset = Wishlist_M.objects.all()

#         if user_id:
#             queryset = queryset.filter(User_ID=user_id) 

#         serializer = Wishlist_MSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         auth_header = request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         try:
#             decoded_token = jwt.decode(token, 'your-secret-key-here', algorithms=['HS256'])
#             user_id = decoded_token.get("user_id", None)

#             if user_id is not None:
#                 request.data['User_ID'] = user_id  # Assign user_id from JWT to User_ID field
#                 serializer = Wishlist_MPostSerializer(data=request.data)

#                 if serializer.is_valid():
#                     serializer.save()
#                     return Response(serializer.data, status=status.HTTP_201_CREATED)
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#             else:
#                 return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

#         except jwt.ExpiredSignatureError:
#             return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.InvalidTokenError:
#             return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.exceptions.DecodeError:
#             return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class Wishlist_MList(APIView):
    def get(self, request, *args, **kwargs):
    # Extract user_id from JWT token
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        print("Received token:", token)
        try:
            decoded_token = jwt.decode(token,settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)
            product_id = request.query_params.get('product_id')  # Get the product_id from query parameters
            
            # Filter Wishlist data based on user_id and product_id
            queryset = Wishlist_M.objects.all()
            if user_id is not None:
                queryset = queryset.filter(User_ID=user_id)
            if product_id:
                queryset = queryset.filter(P_ID=product_id)
            
            serializer = Wishlist_MSerializer(queryset, many=True)
            return Response(serializer.data)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError as e:
            return Response({"error": "Invalid token", "detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError as e:
            return Response({"error": "Malformed token", "detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "Unknown error", "detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, *args, **kwargs):
        # Extract user_id from JWT token
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)
            
            if user_id is not None:
                request.data['User_ID'] = user_id  # Assign user_id from JWT to User_ID field
                serializer = Wishlist_MPostSerializer(data=request.data)
                
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, *args, **kwargs):
        wishlist_id = kwargs.get('wishlist_id')  # Get the wishlist_id from URL params

        try:
            wishlist_item = Wishlist_M.objects.get(pk=wishlist_id)  # Get the Wishlist item
            wishlist_item.delete()  # Delete the Wishlist item
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist_M.DoesNotExist:
            return Response({"error": "Wishlist item does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)